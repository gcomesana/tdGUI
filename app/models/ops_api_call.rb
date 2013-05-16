require 'coreapi_response_parser'
require 'net/http'
require 'uri'

class OpsApiCall
	include ActiveModel::Validations
	extend ActiveModel::Naming

	CORE_API_URL_OLD = "http://ops.few.vu.nl:9184/opsapi"
	# CORE_API_URL = "http://api.openphacts.org"
	CORE_API_URL = "https://beta.openphacts.org/"
	OPS_API_ID = '86bb218b'
	OPS_API_KEY = '29493600307b1fbd0cec49cbee447073'

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
# @param [String] api_method the url of the api to run (https://beta.openphacts...)
# @param [Hash] options the parameters or options for the API call
# @return [Array] an array with the results or nil if something went wrong
	def request(api_method, options)
		puts ("coreAPi.request(#{api_method.to_s}, opts=#{options.to_s})")

# api_method is https://beta...
# options is all parameters...

		if options[:uri].index('conceptwiki').nil? == false
			# the_url = options[:uri] + "?app_id=#{OPS_API_ID}&app_key=#{OPS_API_KEY}" # it should be uniprot
			the_url = CORE_API_URL
			if api_method == 'proteinInfo'
				the_url = the_url + "target?app_id=#{OPS_API_ID}&app_key=#{OPS_API_KEY}"

			elsif api_method == 'proteinPharmacology'
				the_url = the_url + "target/pharmacology/pages?app_id=#{OPS_API_ID}&app_key=#{OPS_API_KEY}"
			end

		else
			the_url = options[:uri] # it should be uniprot uri...
		end

		response = OpsEndpointsProxy.make_request(the_url, options)

# below would be EndpointsProxy.make_request ('proteinInfo', {protein_uri:...} )
#		response = EndpointsProxy.make_request(api_method, options)

# Check for error when the returned value is not the response itself but a
# negative number as timeout got a kind of connection error
		if response.is_a?(Fixnum) or response.is_a?(Net::HTTPNotFound)
# See the log as InnerProxy class spits out the error there
			return nil
		end
		status = case response.code.to_i
							 when 100..199 then
								 @http_error = "HTTP #{response.msg.to_s}-error"
								 puts @http_error
								 return nil
							 when 200 then #HTTPOK => Success
# hay que ver lo que se retorna para uniprot cuando sea, ya que hay en el innerproxy un uniprot2Hash o así
								 @success = true
								 return JSON.parse(response.body)
							 when 201..407 then
								 @http_error = "HTTP #{response.msg.to_s}-error"
								 puts @http_error
								 return nil
							 when 408 then
								 @http_error = "HTTP post to core API timed out"
								 puts @http_error
								 return nil
							 when 409..600 then
								 puts @http_error
								 @http_error = "HTTP #{response.msg.to_s}-error"
								 return nil
						 end
		#    rescue StandardError => the_exception
		#         raise "OPS API error #{the_exception} - #{the_exception.backtrace.inspect.to_s}"
		#    end
	end

end
