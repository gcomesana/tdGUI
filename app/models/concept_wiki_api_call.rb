require 'net/http'
require 'uri'


class ConceptWikiApiCall
	include ActiveModel::Validations
	include EndpointsProxy
	extend ActiveModel::Naming

	#CONCEPT_WIKI_API_SEARCH_URL = "http://staging.conceptwiki.org/web-ws/concept/search/"
	#CONCEPT_WIKI_API_GET_URL = "http://staging.conceptwiki.org/web-ws/concept/search/get"
	#CONCEPT_WIKI_API_BY_TAG_URL = "http://staging.conceptwiki.org/web-ws/concept/search/byTag"
	#CONCEPT_WIKI_API_FOR_URL_URL = "http://staging.conceptwiki.org/web-ws/concept/search/forUrl"

	CONCEPT_WIKI_API_SEARCH_URL = "http://ops.conceptwiki.org/web-ws/concept/search/"
	CONCEPT_WIKI_API_GET_URL = "http://ops.conceptwiki.org/web-ws/concept/search/get"
	CONCEPT_WIKI_API_BY_TAG_URL = "http://ops.conceptwiki.org/web-ws/concept/search/byTag"
	CONCEPT_WIKI_API_FOR_URL_URL = "http://ops.conceptwiki.org/web-ws/concept/search/forUrl"


	def initialize()
		# For timing the transaction
		@request_time = nil
		@response_time = nil
		@query_time = nil
		@success = false
		@http_error = nil

		@response = nil
		@api_method = nil
		@limit = 30
		@offset = 0
		@results = nil
		@parsed_results = nil

	end


	def success
		@success
	end


	def http_error
		@http_error
	end


	def search_concept(substring, options = {})
		if options[:limit].nil? then
			options[:limit] = @limit
		end
		options[:q] = substring
		url = URI.parse(CONCEPT_WIKI_API_SEARCH_URL)
		results = request(url, options)
		if results == [] then # no concept found
			puts "No concept found!"
			@parsed_results = {:concept_uuid => nil, :concept_label => nil, :tag_uuid => nil, :tag_label => nil}
			return @parsed_results
		elsif results.nil? then
			puts "Concept wiki not responding correctly!"
			return nil
		end
		# parsing the response
		@parsed_results = Array.new
		results.each do |concept|
			result = Hash.new
			# concept uuid
			result[:concept_uuid] = concept['uuid']
			# urls
			if concept['urls'].nil? then
				next
			else
				concept['urls'].each do |url|
					result[:concept_url] = url['value']
					if url['type'] == "PREFERRED"
						result[:concept_url] = url['value']
					end
				end
			end

			# labels
			alt_labels = Array.new
			concept['labels'].each do |label|
				result[:concept_label] = label['text']
				if label['type'] == "PREFERRED"
					result[:concept_label] = label['text']
				end
				if label['type'] == "ALTERNATIVE"
					alt_label = label['text'].gsub(Regexp.new(substring, true), "<b>#{substring}</b>")
					alt_labels.push(alt_label)
				end
			end
			result[:concept_alt_labels] = alt_labels.join('; ')
			#tags
			tag = concept['tags'].first

			result[:tag_uuid] = tag['uuid']
			result[:tag_label] = tag['labels'].first['text']
			@parsed_results.push(result)

		end
		puts @parsed_results.inspect
		@parsed_results
	end



	def get_concept(uuid, options = {})
		if options[:limit].nil? then
			options[:limit] = @limit
		end
		url = URI.parse(CONCEPT_WIKI_API_GET_URL)
		result = request(url, options)
	end



	def search_by_tag(tag_uuid, substring, options = {})
		if options[:limit].nil? then
			options[:limit] = @limit
		end
		options[:q] = substring.strip # + '*'
		options[:query] = substring.strip
		options[:uuid] = tag_uuid
#		url = URI.parse(CONCEPT_WIKI_API_BY_TAG_URL)
		url = CONCEPT_WIKI_API_BY_TAG_URL
		results = request(url, options)

		if results == [] then # no concept found
			puts "No concept found!"
#			@parsed_results = {:concept_uuid => nil, :concept_label => nil, :tag_uuid => nil, :tag_label => nil}
			@parsed_results = Array.new
			return @parsed_results

		elsif results.nil? then
			puts "Concept wiki not responding correctly!"
			return nil
		end
																	# puts "results:\n#{results.inspect}"
																	# parsing the response
		@parsed_results = Array.new
		if results[0]['source'].nil? == false
			results.delete_at(0)
			@parsed_results = results

			return @parsed_results
		end

		results.each do |concept|
			result = Hash.new
			result[:match] = concept['match']
			result[:match].gsub!(/<em>/, '<b>')
			result[:match].gsub!(/<\/em>/, '</b>')
			# concept uuid
			result[:concept_uuid] = concept['uuid']
			# construct concept uri to LDC
			result[:concept_url] = 'http://www.conceptwiki.org/concept/' + (concept['uuid'] ? concept['uuid']: '')

			# urls
			if concept['urls'].nil? then
				next
			else
#				result[:define_url] = 'http://staging.conceptwiki.org/wiki/#/concept/' + concept['uuid'] + '/view'
				result[:define_url] = 'http://ops.conceptwiki.org/wiki/#/concept/' + concept['uuid'] + '/view'
			end

			# labels
			result[:concept_label] = nil
			alt_labels = Array.new
			concept['labels'].each do |label|
				if not label['language']['code'] == 'en' then # only use english labels
					next # we skip all non english labels
				end
				if result[:concept_label].nil? then
					result[:concept_label] = label['text'] # In case there is no preferred label we use the first one
				end
				if label['type'] == "PREFERRED"
					result[:concept_label] = label['text']
				end
				if label['type'] == "ALTERNATIVE"
					#this line causes errors if the submitted string does not compile as a regex
					#why are we returning html <b> tags to the UI anyway
					#Can we not use javascript to do this regex work
					alt_label = label['text'].gsub(Regexp.new(substring, true), "<b>#{substring}</b>")
					alt_labels.push(alt_label)
				end
			end
			result[:concept_alt_labels] = alt_labels.join('; ')

			#tags
			tag = concept['tags'].first
			result[:tag_uuid] = tag['uuid']
			result[:tag_label] = tag['labels'].first['text']
			@parsed_results.push(result)

		end
		@parsed_results
	end # EO search_by_tag



	def search_for_url(substring, options = {})
		if options[:limit].nil? then
			options[:limit] = @limit
		end
		options[:q] = substring
		url = URI.parse(CONCEPT_WIKI_API_FOR_URL_URL)
		result = request(url, options)
	end


=begin
	def checkConceptWiki
		# check to see if endpoint is responding
		#		api_method = 'proteinInfo'
		#		prot_uri = 'http://chem2bio2rdf.org/chembl/resource/chembl_targets/12261'
		prot_uri = CONCEPT_WIKI_API_SEARCH_URL
		options = Hash.new
		options[:limit] = 1
		options[:offset] = 0
		options[:q] = 'tp53' # default test

		url = URI.parse(prot_uri)
												 #		 url = checkEndpoints()
		result = request(url, options)

		if result == nil || result.length == 0
			false
		else
			true
		end
	end
=end



private
	def request(url, options)
#		puts "\nIssues call to ConceptWiki API \"#{p url}\" with options: \"#{p options}\"\n"

		conceptApiOk = EndpointsProxy.checkConceptWiki
		coreApiOk = EndpointsProxy.check_coreAPI
		endpoint_ok = conceptApiOk && coreApiOk
		url = endpoint_ok ? url: EndpointsProxy.get_uniprot_concept_endpoint

		puts "got endpoint: #{url}"
#		url = URI.parse(url)
		@request_time = Time.now
#		@response = Net::HTTP.post_form(url, options)
		@response = EndpointsProxy.make_request(url, options)
		@response_time = Time.now
		@query_time = @response_time - @request_time
puts "Call tooooooook #{@query_time} seconds"

		status = case @response.code.to_i
							 when 100..199 then
								 @http_error = "HTTP #{@response.code}-error"
								 puts @http_error
								 return nil

							 when 200 then #HTTPOK =>  Success
								 	@success = true
								 	begin
								 		@results = JSON.parse(@response.body)
									rescue JSON::ParserError
										if @response.body == "" then
											@results = []
										else
											json_results = EndpointsProxy.uniprot2json(@response.body, options[:query])
											@results = JSON.parse(json_results) # @results is an Array
										end
									end

								 return @results
							 #         parsed_responce = CoreApiResponseParser.parse_response(@response)
							 #          @results = Array.new
							 #          parsed_responce.each do |solution|
							 #             rdf = solution.to_hash
							 #             rdf.each {|key, value| rdf[key] = value.to_s}
							 #             @results.push(rdf)
							 #          end
							 #          return @results
							 when 201..403 then
								 @http_error = "HTTP #{@response.code}-error"
								 puts @http_error
								 return nil
							 when 404 then
								 @results = []
								 return @results
							 when 408 then
								 @http_error = "HTTP post to core API timed out"
								 puts @http_error
								 return nil
							 when 409..600 then
								 puts @http_error
								 @http_error = "HTTP #{@response.code}-error"
								 return nil
						 end
#    rescue StandardError => the_exception
#         raise "OPS API error #{the_exception} - #{the_exception.backtrace.inspect.to_s}"
#    end
	end


end