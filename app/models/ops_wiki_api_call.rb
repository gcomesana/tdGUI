require 'net/http'
require 'uri'


class OpsWikiApiCall
	include ActiveModel::Validations
	include OpsEndpointsProxy
	extend ActiveModel::Naming

	#CONCEPT_WIKI_API_SEARCH_URL = "http://staging.conceptwiki.org/web-ws/concept/search/"
	#CONCEPT_WIKI_API_GET_URL = "http://staging.conceptwiki.org/web-ws/concept/search/get"
	#CONCEPT_WIKI_API_BY_TAG_URL = "http://staging.conceptwiki.org/web-ws/concept/search/byTag"
	#CONCEPT_WIKI_API_FOR_URL_URL = "http://staging.conceptwiki.org/web-ws/concept/search/forUrl"

	OPS_API_ID = '86bb218b'
	OPS_API_KEY = '29493600307b1fbd0cec49cbee447073'

	CONCEPT_WIKI_API_SEARCH_URL = "http://ops.conceptwiki.org/web-ws/concept/search/"
	CONCEPT_WIKI_API_GET_URL = "http://ops.conceptwiki.org/web-ws/concept/search/get"
	# CONCEPT_WIKI_API_BY_TAG_URL = "http://ops.conceptwiki.org/web-ws/concept/search/byTag"
	OPS_WIKI_API_BY_TAG_URL = "https://beta.openphacts.org/search/byTag?app_id=#{OPS_API_ID}&app_key=#{OPS_API_KEY}&q=xxxx"
	# "&limit=5&uuid=eeaec894-d856-4106-9fa1-662b1dc6c6f1&_format=json"
	CONCEPT_WIKI_API_FOR_URL_URL = "http://ops.conceptwiki.org/web-ws/concept/search/forUrl"

	TARGET_SEMANTIC_TAG = 'eeaec894-d856-4106-9fa1-662b1dc6c6f1'
	COMPOUND_SEMANTIC_TAG = '07a84994-e464-4bbf-812a-a4b96fa3d197'

	def initialize
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

	def search_concept

	end

	def get_concept

	end


	# Performs a search by tag. The tag says which entity to search
	# @tag_uuid [String] an string identifying a semantic type
	# @substring [String] the string to query
	# @options [Hash] a hash with the parameters to configure the search (like limit)
	def search_by_tag(tag_uuid, substring, options = {})
		substring = CGI::escape(substring.strip)
		url = OPS_WIKI_API_BY_TAG_URL.gsub(/xxxx/, substring)

		if options[:limit].nil? then
			options[:limit] = @limit
		end

		options[:q] = substring   # + '*'
		options[:query] = substring
		options[:uuid] = tag_uuid
		options[:_format] = 'json'

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

		@parsed_results = Array.new
		format_result(results['result']['primaryTopic']['result'])

		return @parsed_results
=begin
		if results[0]['source'].nil? == false
			results.delete_at(0)
			# @parsed_results = results
			format_result(results['result']['primaryTopic'])

			return @parsed_results
		end
=end

	end




	def search_for_url

	end



private
	# Takes account of all topics regarding to the request:
	# - check for api alive
	# - builds the correct request
	# - format the results
	# Most of this issues are managed by EndpointsProxy
	def request(url, options)
		puts "got endpoint: #{url}"
#		url = URI.parse(url)
		@request_time = Time.now
#		@response = Net::HTTP.post_form(url, options)
# url="http://ops.conceptwiki.org/web-ws/concept/search/byTag"
# opttions=[uuid:tolchurro, query:term, limit, offset]
		@response = OpsEndpointsProxy.make_request(url, options)
		if @response.is_a?(Fixnum)
			@response = OpsEndpointsProxy.make_request(url, options) # preventing connection errors
		end	
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



	def format_result (results)
		if results.nil?
			@parsed_results = []
			return
		end

		results.each do |concept|
			result = Hash.new
			result[:match] = concept['match']
			result[:match].gsub!(/<em>/, '<b>')
			result[:match].gsub!(/<\/em>/, '</b>')
			# concept uuid
			semanticTagHash = {}
			if concept['semanticTag'].is_a?(Array)
				semanticTagHash = concept['semanticTag'][0]
			else
				semanticTagHash = concept['semanticTag']
			end

			concept_uuid = concept['_about'][concept['_about'].rindex('/')+1..concept['_about'].length]
			result[:uuid] = concept_uuid
			# construct concept uri to LDC
			# result[:ops_uri] = "http://ops.conceptwiki.org/wiki/#/concept/#{(concept['uuid'] ? concept['uuid']: '')}/view"

			# urls
=begin
			if concept['urls'].nil? then
				next
			else
#				result[:define_url] = 'http://staging.conceptwiki.org/wiki/#/concept/' + concept['uuid'] + '/view'
				result[:pref_url] = 'http://ops.conceptwiki.org/wiki/#/concept/' + concept['uuid'] + '/view'
			end
=end
			result[:pref_url] = ""
			if concept['_about'].nil? == false
				result[:pref_url] = concept['_about']
			else
				concept['exactMatch'].each do |elem|
					if elem['matchType'] == 'PREFERRED'
						result[:pref_url] = elem['url']
					end
				end
			end

			# labels
			# result[:pref_label] = semanticTagHash['prefLabel']
			result[:pref_label] = concept['prefLabel_en']

			alt_labels = Array.new
			if concept['altLabel'].nil? == false and concept['altLabel'].is_a?(Array)
				alt_labels << concept['altLabel']
				alt_labels.flatten!
=begin
				concept['altLabel'].each do |label|
					if not label['language']['code'] == 'en' then # only use english labels
						next # we skip all non english labels
					end
					if result[:pref_label].nil? then
						result[:pref_label] = label['text'] # In case there is no preferred label we use the first one
					end
					if label['type'] == "PREFERRED"
						result[:pref_label] = label['text']
					end
					if label['type'] == "ALTERNATIVE"
						#this line causes errors if the submitted string does not compile as a regex
						#why are we returning html <b> tags to the UI anyway
						#Can we not use javascript to do this regex work
						alt_label = label['text'].gsub(Regexp.new(substring, true), "<b>#{substring}</b>")
						alt_labels.push(alt_label)
					end
				end
=end
			else
				alt_labels << concept['altLabel'] if concept['altLabel'].nil? == false
			end
			result[:alt_labels] = alt_labels.join('; ') if alt_labels.length > 0


			#tags
## 			tag = concept['tags'].first
			#			result[:tag_uuid] = tag['uuid']
## 			result[:concept_type_tags] = tag['labels'].first['text']
			@parsed_results.push(result)

		end
		@parsed_results
	end # EO format_results

end