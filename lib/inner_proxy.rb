require 'net/http'

class InnerProxy
		private
# Suppossed endpoints for coreApi
		CORE_API_URL_83 = "http://ops.few.vu.nl:9183/opsapi"
		CORE_API_URL_84 = "http://ops.few.vu.nl:9184/opsapi"
		CORE_API_URL_85 = "http://ops.few.vu.nl:9185/opsapi"
		CORE_API_URL_86 = "http://ops.few.vu.nl:9186/opsapi"
		CORE_API_URL_87 = "http://ops.few.vu.nl:9187/opsapi"

# URL for conceptwiki
		CONCEPT_WIKI_API_SEARCH_URL = "http://staging.conceptwiki.org/web-ws/concept/search/"

		TIMEOUT = 1.5 # arbitrary timeout to ping endpoints


		public
		def initialize ()
			@coreApiEndpoints = [CORE_API_URL_83, CORE_API_URL_84, CORE_API_URL_85,
														CORE_API_URL_86, CORE_API_URL_87]
			@coreApi_method = 'proteinInfo'
			@coreApi_uri = 'http://chem2bio2rdf.org/chembl/resource/chembl_targets/12261'
			@coreEndpointReady = nil
			@coreEndpointsChecked = 0

			@requestErrMsg = ''
		end


		def coreEndpointReady
			@coreEndpointReady
		end


		def coreEndpointsChecked
			@coreEndpointsChecked
		end


# Checks the conceptWiki endpoint, which is different of the coreApi endpoint
		def checkConceptWiki ()
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
			result = nil
			Timeout::timeout (1.5) do
				result = request(url, options)
			end

			if result == nil || result < 0
				false
			else
				true
			end
		end # EO checkConcept...



		def checkCoreAPI ()
			options = Hash.new
			options[:uri] =  '<' + @coreApi_uri + '>'
			options[:limit] =  1
			options[:offset] = 0
			options[:method] = @coreApi_method

			alive = 0
			@coreEndpointsChecked = 0
			@coreApiEndpoints.each do |endpoint|
# puts "Checking #{endpoint}"
				Timeout::timeout (1.5) do
					alive = request(endpoint, options)
					@coreEndpointsChecked += 1
				end

			  if alive > 0 then
# puts "#{endpoint} is alive\n"
					@coreEndpointReady = endpoint
					break
			  end
			#  break alive if alive != -1 && alive != -2 && alive != -3
			end # EO loop on endopoints

			alive > 0? true: false
		end # EO checkCoreApi



		private
# request (addrs, opts)
# Make a simple http request and returns the response code
		def request (addrs, opts)
=begin
			uri = URI.parse (addrs)
			myHttp = Net::HTTP.new(uri.host, uri.port)
			request = Net::HTTP::Post.new(uri.request_uri)
			request["Content-Type"] = "application/json"

			request.set_form_data(opts)
			response = Net::HTTP::post_form(uri, opts)
=end

			uri = URI.parse (addrs) rescue addrs
			response = Net::HTTP.post_form(uri == nil ? addrs: uri, opts)
			@requestErrMsg = "Request success"
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
				response.code.to_i
		end # EO checkEndpoint

	end  # EO class InnerProxy