require 'coreapi_response_parser'
require 'net/http'
require 'uri'

class CoreApiCall
	include ActiveModel::Validations
	extend ActiveModel::Naming

	CORE_API_URL = "http://ops.few.vu.nl:9184/opsapi"
	OP_PROTEIN_INFO = 'proteinInfo'

	def initialize(url = CORE_API_URL, open_timeout = 60, read_timeout = 60)
# Configuring the connection
		@uri = URI.parse(url)
		@http = Net::HTTP.new(@uri.host, @uri.port)
		@http.open_timeout = open_timeout # in seconds
		@http.read_timeout = read_timeout # in seconds

# For timing the transaction
		@request_time = nil
		@response_time = nil
		@query_time = nil
		@success = false
		@http_error = nil

		@api_method = nil
		@limit = 100
		@offset = 0

		@results = nil
	end


# Gets the value of the success attribute
# @return [Object] the value of success attribute
	def success
		@success
	end


# Gets the value of the http_error attribute
# @return [Object] the value of http_error attribute
	def http_error
		@http_error
	end



# Performs a HTTP request based on the paremeters
# @param [String] api_method the method to perform against the core API
# @param [Hash] options the parameters or options for the API call
# @return [Array] an array with the results or nil if something went wrong
	def request(api_method, options)
puts ("coreAPi.request(#{api_method.to_s}, opts=#{options.to_s})")

#		@method = api_method
#		if @method.nil? then
#			raise "No method API method selected! Please specify a OPS coreAPI method"
#		end
#		options[:method] = @method
#
#		if options[:limit].nil? then
#			options[:limit] = @limit
#		end
#		if options[:offset].nil? then
#			options[:offset] = @offset
#		end
#		# we store the settings for a possible later call
#		if not options[:named_graph_uri].nil? then
#			@named_graph_uri = options[:named_graph_uri]
#		end
#		if not options[:default_graph_uri] then
#			@default_graph_uri = options[:default_graph_uri]
#		end
#		puts "\nIssues call to coreAPI on #{@uri.inspect} with options: #{options.inspect}\n"
#
#		request = Net::HTTP::Post.new(@uri.path)
#		# Tweak headers, removing this will default to application/x-www-form-urlencoded
#		request["Content-Type"] = "application/json"
#		request.form_data = options
## puts ("[*** coreAPI request] response = EndpointsProxy.make_request(#{api_method.to_s}, #{options.to_s})")
#
#		response = nil
#		start_time = Time.now
#		begin
#			@http.start do |http|
#				response = http.request(request)
#			end
#		rescue Timeout::Error
#			query_time = Time.now - start_time
#			puts "Timeout after #{query_time} seconds"
#			raise Timeout::Error
#		end
#
#		@query_time = Time.now - start_time
#
#		puts "Call took #{@query_time} seconds"

# api_method: proteinInfo or similar
# options = [url: http://conceptwiki/concept/..., method->proteinInfo]
		response = EndpointsProxy.make_request(api_method, options)
# below would be EndpointsProxy.make_request ('proteinInfo', {protein_uri:...} )
#		response = EndpointsProxy.make_request(api_method, options)
		status = case response.code.to_i
							 when 100..199 then
								 @http_error = "HTTP #{status.to_s}-error"
								 puts @http_error
								 return nil
							 when 200 then #HTTPOK => Success
								 @success = true
								 parsed_response = CoreApiResponseParser.parse_response(response)
								 if parsed_response.instance_of?(Hash)
									 return [parsed_response]
								 end
								 @results = Array.new
								 parsed_response.each do |solution|
									 rdf = solution.to_hash
									 rdf.each { |key, value| rdf[key] = value.to_s }
									 @results.push(rdf)
								 end
								 return @results
							 when 201..407 then
								 @http_error = "HTTP #{status.to_s}-error"
								 puts @http_error
								 return nil
							 when 408 then
								 @http_error = "HTTP post to core API timed out"
								 puts @http_error
								 return nil
							 when 409..600 then
								 puts @http_error
								 @http_error = "HTTP #{status.to_s}-error"
								 return nil
						 end
		#    rescue StandardError => the_exception
		#         raise "OPS API error #{the_exception} - #{the_exception.backtrace.inspect.to_s}"
		#    end
	end

end
