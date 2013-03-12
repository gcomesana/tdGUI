

# TODO para ver lo del xml ver el API formats en el grape y a ver lo de la documentación con el swagger
require 'net/http'
require 'uri'
require 'grape-swagger'

module TargetDossierApi
	class TDApi < Grape::API
		prefix 'api' # prefix goes before version!!!!
#		version 'v1', :using => :path # host/td/api/v1...
#		format :json

		TIMEOUT = 2.5 # arbitrary timeout to ping endpoints

		INTACT_CV_THRESHOLD = 0.3
		INTACT_NUM_NEIGHS = 5

		before do
			header['Access-Control-Allow-Origin'] = '*'
			header['Access-Control-Request-Method'] = '*'
			header['Access-Control-Allow-Methods'] = 'POST, GET, OPTIONS, PUT, PATCH, DELETE'
			header['Access-Control-Allow-Headers'] = 'api_key,content-type'

			@proxy = APIProxy.new
		end

		helpers do

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
					concept_proxy = ConceptWikiApiCall.new
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

		end # helpers



		resource '' do
			# /api/status[?param_test=<something>]
			params do
				optional :param_test, :type => String, :desc => 'A ping string. It will be returned in the response'
			end
			desc 'this is only a API status test', {
				:notes => 'Just a test with a fixed json response.'
			}
			get '/status' do
				puts "/api/status?param_test=#{params[:param_test]}"
				proxy = TdguiProxy.new

				proxy.test(params[:param_test])
			end

		end


## target ##################################################################
		resource 'target' do # formerly uniprot, /td/api/v1/uniprot...

			# /td/api/v1/uniprot/multiple?entries=<acc_1,acc_2, ..., acc_i>
			params do
				requires :entries, :type => String, :regexp => /([A-Z][A-Z0-9]{5}\,?)+/, :desc => 'A comma separated list of uniprot acc and/or uuids'
				optional :output, :type => String, :regexp => /xml|json/, :desc => 'The output format'
			end
			desc "Retrieve multiple uniprot entries through /td/api/v1/uniprot/multiple?<entries>", {
				:notes => 'multiple'
			}
			get '/multiple/:entries' do
				proxy = TdguiProxy.new

				proxy.get_multiple_entries(params[:entries])
			end


			# /td/api/v1/uniprot/byname/<name>[.json]?uuid=<uuid>
			params do
				requires :name, :type => String, :desc => "A name like 'adenosine recpetor...'"
				optional :uuid, :type => String
			end
			desc 'Gets target info from a name. Append .xml to the request to get XML output', {
				:notes => 'byname'
			}
			get '/byname/:name' do
				proxy = TdguiProxy.new

				proxy.get_uniprot_by_name(params[:name], params[:uuid])
			end


			# /td/api/v1/uniprot/<accession>
			params do
				requires :acc, :type => String, :regexp => /[A-Z][A-Z0-9]{5}/
			end
			desc 'Gets an uniprot entry info from accession. Append .xml to the request to get XML output', {
				:notes => 'accession'
			}
			get ':acc' do
				proxy = TdguiProxy.new

				proxy.get_uniprot_by_acc(params[:acc])
			end


			params do
				requires :acc, :type => String, :regexp => /[A-Z][A-Z0-9]{5}/, :desc => 'The uniprot accession'
			end
			desc 'Return an array the genes for the target. Along with the gene, the type of the id is sent back'
			get '/genes/:acc' do
				proxy = TdguiProxy.new
				uniprot_hash = proxy.get_uniprot_by_acc(params[:acc])

				uniprot_hash['allgenes']
			end


			params do
				requires :gene, :type => String, :desc => 'A gene name'
			end
			desc 'Return information about the target yield from the gene name'
			get '/bygene/:gene' do
				proxy = TdguiProxy.new
				uniprot_hash = proxy.get_uniprot_by_gene(params[:gene])

				uniprot_hash
			end



			desc 'Gets the targets involved in the given disease according to http://www.uniprot.org/faq/19'
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
			params do
				requires :acc, :type => String, :regexp => /[A-Z][A-Z0-9]{5}/, :desc => 'An uniprot accession'
				optional :cv, :type => Float, :desc => 'Confidence value for interactions'
				optional :neighs, :type => Integer, :desc => 'Number of neighbours (close related targets) in the interaction network'
			end
			desc "Get a json response ready to use with a JIT graph"
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

		end # EO resource interactions



## ops ###################################################################
		resource 'ops' do

			# /td/api/v1/ops/lookup?type=compound&term=term
			# actually, compound is disallowed
			params do
				requires :type, :type => String, :regexp => /compound|protein|concept/
				requires :term, :type => String
			end
			desc "Gets an entry from concept wiki", {
				:notes => 'Request should be /td/api/ops/lookup/<type>/<term>...'
			}
			get '/lookup/:type/:term' do
				proxy = ConceptWikiApiCall.new
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


			# /td/api/v1/ops/protein/<[uuid|accession]>
			# 
			params do
				requires :protein_id, :type => String, :regexp => /([0-9a-f]{8}(-[0-9a-f]{4}){3}-[0-9a-f]{12})|([A-Z][A-Z0-9]{5})/
			end
			desc 'Gets a json representing the protein_info got from OPS API. Param can be either a uniprot accession or a concept uuid'
			get '/protein/:protein_id' do
				prot_uuid = protein_concept_uuid(params[:protein_id])
				prot_uri = "http://ops.conceptwiki.org/wiki/#/concept/#{prot_uuid}/view"
				core_proxy = CoreApiCall.new
				options = Hash.new
				api_method = 'proteinInfo'
				options[:uri] = '<' + prot_uri + '>'
#				options[:limit] =  params[:limit]
#				options[:offset] = params[:offset]
				resp = core_proxy.request( api_method, options)

				resp
			end


			params do
				requires :protein_id, :type => String, :regexp => /([0-9a-f]{8}(-[0-9a-f]{4}){3}-[0-9a-f]{12})|([A-Z][A-Z0-9]{5})/
			end
			desc 'Gets a json representing the protein pharmacology info got from OPS API. Param can be either a uniprot accession or a concept uuid'
			get '/protein/pharma/:protein_id/count' do
				prot_uuid = protein_concept_uuid(params[:protein_id])
				prot_uri = "http://www.conceptwiki.org/concept/#{prot_uuid}"
				td_proxy = TdguiProxy.new

				resp = td_proxy.get_pharm_count prot_uri

				resp
			end


			params do
				requires :protein_id, :type => String, :regexp => /([0-9a-f]{8}(-[0-9a-f]{4}){3}-[0-9a-f]{12})|([A-Z][A-Z0-9]{5})/
				optional :page, :type => Integer, :desc => 'The number of the page of results'
			end
			desc 'Gets a json representing the protein pharmacology info got from OPS API. Param can be either a uniprot accession or a concept uuid', {
				:notes => 'Request is like /td/api/ops/protein/pharma/uuid[?page=number]'
			}
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
			params do
				requires :query_term, :type => String
				optional :output, :type => String, :regexp => /xml|json/
			end
			desc 'Gets a list of proteins matching the query', {
				:notes => 'Request should be like /td/api/nextprot/list/<term>[?format=[xml|json]]'
			}
			get '/list/:query_term' do
#				resp = nextprot_req('list', {'query'=>params[:query_term], 'format'=>params[:format]})
				resp = nextprot_req('list', [params[:query_term], params[:output]])

				resp.body
			end


			desc "Gets information about a target's isoform. Features are allowed. Similarly to previous one, based on uniprot/nextprot acc"
			params do
				requires :acc, :type => String, :regexp => /(NX_)?[A-Z][A-Z0-9]{5}/
				optional :feature, :type => String, :regexp => /ptrans-modif|variant|localisation/
				optional :output, :type => String, :regexp => /xml|json/
			end
			get '/isoform/:acc' do
#				resp = nextprot_req('isoform', {:acc => params[:acc], :feat => params[:feature], :format=>params[:format]})
				resp = nextprot_req('isoform', [params[:acc], params[:feature], params[:output]])

				resp.body
			end


			params do
				requires :number, type: Integer, desc: 'A mandatory integer param'
				optional :letter, type: String, desc: 'An optional string param'
			end
			get '/test/:number' do
				resp = nextprot_req('', ['NX_P13051', 'localisation', ''])

				resp.body
			end


			desc 'Gets information about a target based on a uniprot/nextprot accession', {
				:notes => 'Requests should be /td/api/nextprot/<accession>[?feat=<feat>].xml|json'
			}
			params do
				requires :acc, :type => String, :regexp => /(NX_)?[A-Z][A-Z0-9]{5}/
				optional :feat, :type => String, :regexp => /ptrans-modif|variant|localisation|expression/
				optional :output, :type => String, :regexp => /xml|json/
			end
			get ':acc' do
#				resp = nextprot_req('', {:acc => params[:acc], :feat => params[:feature], :format=>params[:format]})
				acc = params[:acc]
				if (acc =~ /[A-Z][A-Z0-9]{5}/) == 0
					acc = "NX_#{acc}"
				end

				resp = nextprot_req('', [acc, params[:feature], params[:output]])

				resp.body
			end

		end
	end # EO class TDApi



end