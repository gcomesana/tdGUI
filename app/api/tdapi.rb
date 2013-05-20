

# TODO para ver lo del xml ver el API formats en el grape y a ver lo de la documentación con el swagger
require 'net/http'
require 'uri'
require 'grape-swagger'

module TargetDossierApi

	class InfoLogger
		def info (msg)
			puts "#{Time.now}.- #{msg}\n"
		end
	end


	class TDApi < Grape::API
		prefix 'api' # prefix goes before version!!!!
#		version 'v1', :using => :path # host/td/api/v1...
#		format :json

		content_type :json, 'application/json'
		content_type :xml, 'application/xml'
		TIMEOUT = 2.5 # arbitrary timeout to ping endpoints

		INTACT_CV_THRESHOLD = 0.3
		INTACT_NUM_NEIGHS = 5

		logger = InfoLogger.new

		before do
			header['Access-Control-Allow-Origin'] = '*'
			header['Access-Control-Request-Method'] = '*'
			header['Access-Control-Allow-Methods'] = 'POST, GET, OPTIONS, PUT, PATCH, DELETE'
			header['Access-Control-Allow-Headers'] = 'api_key,content-type'

			@proxy = APIProxy.new
		end

		helpers do

			def logger
				TDApi.logger
			end


# Checks if the parameter is an uniprot accession or an uuid. If the former, then
# a request to concept wiki is carried out to get the uuid corresponding to the
# uniprot accession
# @param {String} protein_id an protein identifier, either a uuid or uniprot accessin
# @return {String} the uuid for the param
			def protein_concept_uuid (protein_id)
			puts "@ protein_concept_uri (#{protein_id})\n"
				is_accession = (protein_id =~ /[A-Z][A-Z0-9]{5}/) == 0
				is_uuid = (protein_id =~ /[0-9a-f]{8}(-[0-9a-f]{4}){3}-[0-9a-f]{12}/) == 0
				uuid = nil
				prot_uri = nil

				if is_accession
					protein_tag = 'eeaec894-d856-4106-9fa1-662b1dc6c6f1'
					# concept_proxy = ConceptWikiApiCall.new
					concept_proxy = OpsWikiApiCall.new
					resp = concept_proxy.search_by_tag(protein_tag, params[:protein_id], {})
					uuid = resp[0][:uuid]
					prot_uri = resp[0][:ops_uri]
				end

				if is_uuid
					uuid = params[:protein_id]
				end

				uuid
			end

# Makes a http GET request to the REST services @ nextprot.org.
# @param {String} method the type or request, one of list, isoform or nothing (=> nil or '')
# @param {Hash} a hash with pairs k => v, name of the param_name for nextprot, value.
# If param values don't have name associate, k will be param_i, i is a number
# @return response the response from the server
			def nextprot_req (method, params)
				base_url = "http://www.nextprot.org/rest"
				addrs = nil

				if method == 'list'
					addrs = "#{base_url}/protein/list?query=#{params[0]}"
					if params[1].nil? == false && params[1] != ""
						addrs ="#{addrs}&format=#{params[1]}"
					else
						addrs = "#{addrs}&format=json"
					end

				else # method has to be either nothing (nil or '', to get an entry) or isoform
					addrs = (method.nil? || method == '') ? "#{base_url}/entry/#{params[0]}": "#{base_url}/isoform/#{params[0]}"
					# feature
					if params[1].nil? == false && params[1] != ""
						addrs = "#{addrs}/#{params[1]}"
					end
					# format
					if params[2].nil? == false && params[2] != ""
						addrs ="#{addrs}?format=#{params[2]}"
					else
						addrs = "#{addrs}?format=json"
					end

				end

				puts "#{addrs}\n"
				uri = URI.parse(addrs) rescue addrs
				http = Net::HTTP.new(uri.host, uri.port)
				req = Net::HTTP::Get.new(uri.request_uri)
				begin
					response = Timeout::timeout(TIMEOUT) {
						http.request(req)
					}
				rescue Timeout::Error => exc
					@requestErrMsg = "ERROR: #{exc.message}"
					-1

				rescue Errno::ETIMEDOUT => exc
					@requestErrMsg = "ERROR: #{exc.message}"
					-2

				rescue Errno::ECONNREFUSED => exc
					@requestErrMsg = "ERROR: #{exc.message}"
					-3

				else
					#    puts "Response is..."
					#    puts response.code.to_i
					response
				end
			end # nextprot_req helper


			# Convert source format into a format to be processed by extjs custom component
			# @param [Array] array_targets is an array of hashes
			def convert_by_disease (array_targets)
				result = Array.new

				array_targets.each { |target|
					target_hash = Hash.new

					target_hash[:pref_label] = target['name']
					target_hash[:match] = ''
					target_hash[:pref_url] = 'http://www.uniprot.org/uniprot'+target['acc']
					target_hash[:uuid] = ''

					result << target_hash
				}
				result
			end

		end # helpers



		resource '' do
			# /api/status[?param_test=<something>]
			desc 'Check the API status to see if the API functions are reachable', {
				:notes => 'Returns an simple JSON object. If a param (/api/status?param_test=xxx) is passed in, it will be included in the response'
			}
			params do
				optional :param_test, :type => String, :desc => 'A ping string. It will be returned in the response'
			end
			get '/status' do
				logger.info "/api/status?param_test=#{params[:param_test]}"
				proxy = TdguiProxy.new

				proxy.test(params[:param_test])
			end



			desc 'Return gene names from a text search on Uniprot'
			params do
				requires :term, :type => String, :desc => 'The term search'
				optional :offset, :type => Integer, :desc => 'The number of the first result to return of the whole list of results'
				optional :limit, :type => Integer, :desc => 'The max number of results to send back'
				optional :callback, :type => String, :desc => 'A callback function for JSONP requests'
			end
			get '/gene/lookup' do
				proxy = TdguiProxy.new
				res = proxy.gene_lookup(params[:term], params[:limit])

				res
			end






		end



## target ##################################################################
		resource 'target' do # formerly uniprot, /td/api/v1/uniprot...

			# /td/api/v1/uniprot/multiple?entries=<acc_1,acc_2, ..., acc_i>
			desc "Retrieve multiple UniprotKB entries", {
				:notes => 'Return a json array with information about the targets related to the parameters'
			}
			params do
				requires :entries, :type => String, :regexp => /^([A-Z][A-Z0-9]{5}\,?)+$/, :desc => 'A comma separated list of uniprot acc and/or uuids'
				# optional :output, :type => String, :regexp => /xml|json/, :desc => 'The output format'
			end
			get '/multiple/:entries' do
				proxy = TdguiProxy.new
				logger.info "Getting info for #{params[:entries]}"

				resp = proxy.get_multiple_entries(params[:entries]) # this is a hash
				{:totalcount => resp['totalCount'], :success => resp['success'],
				 :entries => resp['ops_records']}
			end

=begin
			desc 'Check the API status to see if the API functions are reachable', {
				:notes => 'Returns an simple JSON object. If a param (/api/status?param_test=xxx) is passed in, it will be included in the response'
			}
			params do
				optional :param_test, :type => String, :desc => 'A ping string. It will be returned in the response'
			end
			get '/status' do
				logger.info "/api/status?param_test=#{params[:param_test]}"
				proxy = TdguiProxy.new

				proxy.test(params[:param_test])
			end
=end



			desc "Retrieve a gene json from a gene name"
			params do
				requires :genename, :type => String, :desc => 'A gene name, for example, runx1'
			end
			get '/by_gene' do
				proxy = TdguiProxy.new

				genehash = proxy.get_uniprot_by_gene(params[:genename])
				genehash
			end




			desc "Gets a set of targets involved in a disease"
			params do
				requires :disease, :type => String, :desc => 'A disease name'
				optional :offset, :type => Integer, :desc => 'The number of the first result to return of the whole list of results'
				optional :limit, :type => Integer, :desc => 'The max number of results to send back'
				optional :callback, :type => String, :desc => 'A callback function for JSONP requests'
			end
			get '/by_disease' do
				targethash = @proxy.get_targets4disease(params[:disease], params[:offset], params[:limit])
				targethash
			end



			# /td/api/v1/uniprot/byname/<name>[.json]?uuid=<uuid>
			desc 'Gets target info from a name. Append .xml to the request to get XML output', {
				:notes => 'byname'
			}
			params do
				requires :name, :type => String, :desc => "A name like 'adenosine receptor...'"
				optional :uuid, :type => String
			end
			get '/byname/:name' do
				proxy = TdguiProxy.new

				proxy.get_uniprot_by_name(params[:name], params[:uuid])
			end


			# /td/api/v1/uniprot/<accession>
			desc 'Gets an uniprot entry info from accession. Only few relevant fields are included in the response'
			params do
				requires :acc, :type => String, :regexp => /^[A-Z][A-Z0-9]{5}$/, :desc => 'An uniprot accession'
			end
			get ':acc' do
				proxy = TdguiProxy.new
				logger.info "Getting info for Uniprot accession #{params[:acc]}"

				proxy.get_uniprot_by_acc(params[:acc])
			end


			desc 'Return an array the genes for the uniprot accession. Along with the gene, the type of the id is included'
			params do
				requires :acc, :type => String, :regexp => /^[A-Z][A-Z0-9]{5}$/, :desc => 'The uniprot accession'
			end
			get '/genes/:acc' do
				proxy = TdguiProxy.new
				uniprot_hash = proxy.get_uniprot_by_acc(params[:acc])

				uniprot_hash['allgenes']
			end


=begin
			desc 'Return information about the target related to the gene name'
			params do
				requires :gene, :type => String, :desc => 'A gene name'
			end
			get '/bygene/:gene' do
				proxy = TdguiProxy.new
				uniprot_hash = proxy.get_uniprot_by_gene(params[:gene])

				uniprot_hash
			end
=end



			desc 'Gets the targets and genes involved in the given disease according to http://www.uniprot.org/faq/19'
			params do
				requires :disease, :type => String, :desc => 'A disease/disorder name, like asthma or anemia'
				optional :callback, :type => String, :desc => 'A callback function for JSONP requests'
				optional :offset, :type => Integer, :desc => 'The number of the first result to return of the whole list of results'
				optional :limit, :type => Integer, :desc => 'The max number of results to send back'
			end
			get '/disease/:disease' do
				targets_hash = @proxy.get_targets4disease(params[:disease], params[:offset], params[:limit])

				targets_hash
			end


		end # EO resource uniprot



## interactions ##############################################################
		resource 'interactions' do

			# /td/api/v1/interactions/<:acc>[?cv=<threshold>&neighs=<num_of_neighs>]
			desc "Get a json response ready to use with a JIT graph", {
				:notes => 'See http://philogb.github.com/jit/demos.html, ForceDirected for more info.'
			}
			params do
				requires :acc, :type => String, :regexp => /^[A-Z][A-Z0-9]{5}$/, :desc => 'An uniprot accession'
				optional :cv, :type => Float, :desc => 'Confidence value for interactions'
				optional :neighs, :type => Integer, :desc => 'Number of neighbours (close related targets) in the interaction network'
			end
			get '/:acc' do
				proxy = TdguiProxy.new
				resp = nil

				if params[:cv].nil? && params[:neighs].nil?
					resp = proxy.get_target_interactions(params[:acc])
#					puts "interactions: #{resp.to_s}\n"
				end
				if params[:cv].nil? && params[:neighs].nil? == false
#					puts "interactions: cv is nil and neighs is #{params[:neighs]}\n"
					resp = proxy.get_target_interactions(params[:acc], INTACT_CV_THRESHOLD, params[:neighs])
				end

				if params[:neighs].nil? && params[:cv].nil? == false
#					puts "interactions: neighs is nil and cv is #{params[:cv]}\n"
					resp = proxy.get_target_interactions(params[:acc], params[:cv])
				end

				if params[:neighs].nil? == false && params[:cv].nil? == false
#					puts "interactions: cv is #{params[:cv]} & neighs is #{params[:neighs]}\n"
					resp = proxy.get_target_interactions(params[:acc], params[:cv], params[:neighs])
				end

				resp
			end


			desc "Get a json response with interaction(s) information for the interactors; empty if no interaction was found"
			params do
				requires :interactor1, :type => String, :regexp => /^[A-Z][A-Z0-9]{5}$/, :desc => 'An uniprot accession as for the interactor one'
				requires :interactor2, :type => String, :regexp => /^[A-Z][A-Z0-9]{5}$/, :desc => 'An uniprot accession as for the interactor two'
				optional :threshold, :type => Float, :desc => 'A threshold value to filter the interactions'
			end
			get '/:interactor1/:interactor2' do
			 # {:inter1 => params[:interactor1], :inter2 => params[:interactor2]}
			 	proxy = TdguiProxy.new

			 	if params[:threshold].nil?
			 		interactions = proxy.get_interactions_for(params[:interactor1], params[:interactor2])
			 	else
			 		interactions = proxy.get_interactions_for(params[:interactor1], params[:interactor2], params[:threshold])
			 	end	
			 	interactions
			end

		end # EO resource interactions



## ops ###################################################################
		resource 'ops' do

			# /td/api/v1/ops/lookup?type=compound&term=term
			# actually, compound is disallowed
			desc "Gets an entry from concept wiki", {
				:notes => 'Request should be /td/api/ops/lookup/<type>/<term>...'
			}
			params do
				requires :type, :type => String, :regexp => /compound|protein|concept/
				requires :term, :type => String
			end
			get '/lookup/:type/:term' do
				# proxy = ConceptWikiApiCall.new
				proxy = OpsWikiApiCall.new
				resp = nil
				compound_tag = '07a84994-e464-4bbf-812a-a4b96fa3d197'
				protein_tag = 'eeaec894-d856-4106-9fa1-662b1dc6c6f1'

				case params[:type]
					when "protein"
						resp = proxy.search_by_tag(protein_tag, params[:term], {})

					when "compound"
						resp = {:success => true, :msg => "This method is disallowed"}

					when "concept"
						resp = {:success => true, :msg => "This method is disallowed"} # proxy.search_concept(params[:term], {})

					else # protein -target- by default
						resp = proxy.search_by_tag(protein_tag, params[:term], {})
				end
				resp
			end


			# /api/ops/protein/<uuid>
			desc 'Gets a json representing the protein_info got from OPS API. Param can be a concetp uuid' # either a uniprot accession or a concept uuid'
			params do
				requires :protein_id, :type => String, :regexp => /^([0-9a-f]{8}(-[0-9a-f]{4}){3}-[0-9a-f]{12})|([A-Z][A-Z0-9]{5})$/
			end
			get '/protein/:protein_id' do
				prot_uuid = protein_concept_uuid(params[:protein_id])
				prot_uri = "http://ops.conceptwiki.org/wiki/#/concept/#{prot_uuid}/view"
				prot_uri = "http://www.conceptwiki.org/concept/#{prot_uuid}"
				# core_proxy = CoreApiCall.new
				core_proxy = OpsApiCall.new
				options = Hash.new
				api_method = 'proteinInfo'
				options[:uri] = prot_uri
				options[:format] = 'json'
#				options[:limit] =  params[:limit]
#				options[:offset] = params[:offset]
				resp = core_proxy.request( api_method, options)

				resp
			end


			desc 'Gets a json representing the protein pharmacology info got from OPS API. Param can be a concetp uuid' # either a uniprot accession or a concept uuid'
			params do
				requires :protein_id, :type => String, :regexp => /^([0-9a-f]{8}(-[0-9a-f]{4}){3}-[0-9a-f]{12})|([A-Z][A-Z0-9]{5})$/
			end
			get '/protein/pharma/:protein_id/count' do
				prot_uuid = protein_concept_uuid(params[:protein_id])
				prot_uri = "http://www.conceptwiki.org/concept/#{prot_uuid}"
				td_proxy = TdguiProxy.new

				resp = td_proxy.get_pharm_count prot_uri

				resp
			end


			desc 'Gets a json representing the protein pharmacology info got from OPS API. Param can be a concetp uuid', { # either a uniprot accession or a concept uuid'
				:notes => 'Request is like /td/api/ops/protein/pharma/uuid[?page=number]'
			}
			params do
				requires :protein_id, :type => String, :regexp => /^([0-9a-f]{8}(-[0-9a-f]{4}){3}-[0-9a-f]{12})|([A-Z][A-Z0-9]{5})$/
				optional :page, :type => Integer, :desc => 'The number of the page of results'
			end
			get '/protein/pharma/:protein_id' do
				prot_uuid = protein_concept_uuid(params[:protein_id])
				prot_uri = "http://www.conceptwiki.org/concept/#{prot_uuid}"
				num_page = params[:page].nil? ? 1: params[:page]

				td_proxy = TdguiProxy.new
				resp = td_proxy.get_pharm_results_by_page(prot_uri, num_page, 10)

				resp
			end

		end # EO resource ops


## nexprot ##################################################################
		resource 'nextprot' do
# rest/protein/list?query=kinase&format=json
# rest/entry/NX_P13051/localisation?format=json
# rest/isoform/NX_O00142-2/variant?format=json
			desc 'Gets a list of proteins matching the query', {
				:notes => 'Request should be like /td/api/nextprot/list/<term>[?format=[xml|json]]'
			}
			params do
				requires :query_term, :type => String
				optional :output, :type => String, :regexp => /^xml|json$/
			end
			get '/list/:query_term' do
#				resp = nextprot_req('list', {'query'=>params[:query_term], 'format'=>params[:format]})
				resp = nextprot_req('list', [params[:query_term], params[:output]])

				resp.body
			end


			desc "Gets information about a target's isoform. Features are allowed. Similarly to previous one, based on uniprot/nextprot acc"
			params do
				requires :acc, :type => String, :regexp => /^(NX_)?[A-Z][A-Z0-9]{5}$/
				optional :feature, :type => String, :regexp => /^ptrans-modif|variant|localisation$/
				optional :output, :type => String, :regexp => /^xml|json$/
			end
			get '/isoform/:acc' do
#				resp = nextprot_req('isoform', {:acc => params[:acc], :feat => params[:feature], :format=>params[:format]})
				resp = nextprot_req('isoform', [params[:acc], params[:feature], params[:output]])

				resp.body
			end

=begin
			params do
				requires :number, type: Integer, desc: 'A mandatory integer param'
				optional :letter, type: String, desc: 'An optional string param'
			end
			get '/test/:number' do
				resp = nextprot_req('', ['NX_P13051', 'localisation', ''])

				resp.body
			end
=end

			desc 'Gets information about a target based on a uniprot/nextprot accession', {
				:notes => 'Requests should be /td/api/nextprot/<accession>[?feat=<feat>].xml|json'
			}
			params do
				requires :acc, :type => String, :regexp => /^(NX_)?[A-Z][A-Z0-9]{5}$/
				optional :feat, :type => String, :regexp => /^ptrans-modif|variant|localisation|expression$/
				optional :output, :type => String, :regexp => /^xml|json$/
			end
			get ':acc' do
#				resp = nextprot_req('', {:acc => params[:acc], :feat => params[:feature], :format=>params[:format]})
				acc = params[:acc]
				if (acc =~ /^[A-Z][A-Z0-9]{5}$/) == 0
					acc = "NX_#{acc}"
				end

				resp = nextprot_req('', [acc, params[:feature], params[:output]])

				resp.body
			end

		end


=begin
		resource 'omim' do

			desc 'Gets a list of entries from a disease name'
			params do
				requires :search, :type => String, :desc => 'The disease or disorder search term'
				optional :start, :type => Integer, :desc => 'The offset to start to get entries'
				optional :limit, :type => Integer, :desc => 'The number of entries to retrieve'
				optional :callback, :type => String, :desc => 'The callback for JSONP requests'
			end
			get '/diseases' do
				disease_list = @proxy.omim_disease_lookup(params[:search], params[:start], params[:limit])

				disease_list
			end

		end
=end

	end # EO class TDApi



end