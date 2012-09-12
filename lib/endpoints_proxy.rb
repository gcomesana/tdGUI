

# EndpointsProxy class
# Set the correct endpoint to call on every request, depending whether or not
# the endpoints are alive
require 'inner_proxy.rb'
require 'net/http'
require 'uri'
module EndpointsProxy

private
	@myProxy = InnerProxy.new

# squid proxy parameters
	@proxy_host = 'ubio.cnio.es'
	@proxy_port = 3128

#	URI_REGEX = /^(?=[^&])(?:(?<scheme>[^:\/?#]+):)?(?:\/\/(?<authority>[^\/?#]*))?(?<path>[^?#]*)(?:\?(?<query>[^#]*))?(?:#(?<fragment>.*))?/
  URI_REGEX =	/(http|ftp|https):\/\/[\w\-_]+(\.[\w\-_]+)+([\w\-\.,@?^=%&amp;:\/~\+#]*[\w\-\@?^=%&amp;\/~\+#])?/


# Build a request POST object in order to make a further call to coreAPI from
# api_method and options
# @param [String] api_method the api method to be called by coreAPI
# @param [Hash] options options for the call
# @param [String] ep_ready the coreAPI endpoint which is reachable
# @return [Net::HTTP::Post] a request object
	def self.build_coreapi_req (api_method, options, ep_ready)

		if api_method.nil? then
			raise "No method API method selected! Please specify a OPS coreAPI method"
		end

		options[:method] = api_method

		if options[:limit].nil? then
			options[:limit] = 100
		end

		if options[:offset].nil? then
			options[:offset] = 0
		end

#we store the settings for a possible later call
#		if not options[:named_graph_uri].nil? then
#			@named_graph_uri = options[:named_graph_uri]
#		end
#		if not options[:default_graph_uri] then
#			@default_graph_uri = options[:default_graph_uri]
#		end

		uri = URI.parse(ep_ready)
		@coreAPI_http = Net::HTTP.new(uri.host, uri.port)
		@coreAPI_http.open_timeout = 60 # in seconds
		@coreAPI_http.read_timeout = 60 # in seconds
puts "\nIssues call to coreAPI on #{@uri.inspect} with options: #{options.inspect}\n"

		request = Net::HTTP::Post.new(uri.path)
		# Tweak headers, removing this will default to application/x-www-form-urlencoded
		request["Content-Type"] = "application/json"
		request.form_data = options

		request
	end




public
# Gets a hash with information about a target from uniprot. Basically, call a method
# from InnerProxy class to performa a uniprot request and build up a Hash with the
# relevant information
# (see #InnerProxy)
# @param [String] results the results returned from uniprot
# @return [Hash] a Hash object with uniprot information about the target
		def self.buildup_uniprot_info (results)
			@myProxy.proteinInfo2hash(results)
		end


# Converts a Hash with uniprot data into a json string
# @param [Hash] uniprot_res
# @param [String] query
# @return [String] a json string
	def self.uniprot2json (uniprot_res, query)
		@myProxy.uniprot2json(uniprot_res, query)
	end



# Ping for conceptWiki API endpoint
# Calls the checkConceptWiki method of InnerProxy inner class
# @return [Object] true if conceptWiki endpoint is up and usable; false otherwise
	def self.checkConceptAPI ()

#		@myProxy = InnerProxy.new
		result = @myProxy.checkConceptWiki()
		result
	end


# Ping for coreAPI endpoint
# Calls the checkCoreAPI method of InnerProxy inner class
# Returns true if coreAPI endpoint is up and usable; false otherwise
# If returned true, coreEndpointReady member of InnerProxy class is set to the
# first endpoint ready
# @return [Object] true if coreAPI is alive; false otherwise
	def self.check_coreAPI ()
#		@myProxy = InnerProxy.new
		result = @myProxy.checkCoreAPI()
		result
	end


# Gets the core endpoint which is alive to make requests to it
# @return [String] the address of the endpoint
	def self.get_core_endpoint
		@myProxy.core_endpoint_ready
	end


# Gets the endpoint which is to be used to get information about a concept.
# The default endpoint is conceptWiki; if conceptWiki (or coreAPI) are not alive
# a uniprot endpoint is returned
# @return [String] the endpoint which the concept requests are going to be
	def self.get_concept_endpoint
		status = @myProxy.checkCoreAPI

		status ? @myProxy.conceptwiki_ep: @myProxy.concept_uniprot_ep
	end



# Gets a uniprot endpoint which replies to concept requests
# @return [String] an uniprot endpoing
	def self.get_uniprot_concept_endpoint
		@myProxy.concept_uniprot_ep
	end


# Gets the number of endpoints checked before finding one of them alive
# @return [Integer] number of pinged endpoints
	def self.get_endpoints_checked
		@myProxy.core_endpoints_checked
	end



# Make a request to coreAPI or cconceptwiki or alternative uniprot endpoints
# depending on the url_or_method parameter.
# The check for endpoints for conceptWiki and coreApi were performed in advance
# in the model class (for conceptWiki).
#
# @param [String] url_or_method this parameter is different depending on the source. If
# the source is coreAPI model, it will be the action to call (the api_method);
# if the source is the concept wiki api call model, it should be a uri
# @param [Hash] opts the options to pass to the request
# @return [Net::HTTPResponse] the response object
	def self.make_request (url_or_method, opts)
puts ("make_request (#{url_or_method.to_s}, opts=#{opts.to_s})")

# first, decode url_or_method param
		uri_parts = url_or_method.scan(URI_REGEX)[0]
		is_uri = !uri_parts.nil? && !uri_parts[0].nil? && !uri_parts[1].nil? && !uri_parts[2].nil?

# conceptWiki part
		if is_uri || url_or_method.include?(@myProxy.conceptwiki_ep) then # conceptAPI
puts "Attacking conceptWiki part"
# don't check endpoints for conceptwiki as they were checked concept_wiki_api_call
			ep_alive = check_coreAPI()
			ep_ready = get_concept_endpoint()
#			ep_ready = 'http://www.uniprot.org/uniprot/?format=tab&columns=id,protein%20names,citation,comments,genes&sort=score'

			if ep_alive && url_or_method.include?(ep_ready) then # conceptAPI will be called
				url = URI.parse(url_or_method)
				response = Net::HTTP.post_form(url, opts)
				response

			else # so far, protein_lookup via uniprot
				ep_ready = ep_ready + "&query="+opts[:query]+'+AND+organism:9606'
puts "EndpointsProxy.make_request: #{ep_ready}"
				url = URI.parse(ep_ready)

				req = Net::HTTP::Get.new(url.request_uri)
				res = Net::HTTP.start(url.host, url.port, @proxy_host, @proxy_port) {|http|
					http.request(req)
				}
				json_resp = @myProxy.uniprot2json(res.body, opts[:query]) # necessary to convert to OPS json
				res

			end

# coreAPI part: proteinInfo, pharmaByTargetInfo, ...
#		elsif url.include? @myProxy.coreApiEP then # coreAPI on
		else # url_or_method should be something like 'proteinInfo', 'compoundPharma', 'sparql'
puts "Attacking coreApi part...coreAPIok? #{check_coreAPI()}\n"
			ep_alive = check_coreAPI()
			ep_ready = get_core_endpoint() # ep_alive ? get_endpoint(): nil

# for test purposes, as coreAPI use to be alive at testing time
			if !opts[:uri].nil?
				if opts[:uri].scan(/uniprot/).empty? == false
					ep_alive = false
				end
			end

puts "EndpointsProxy.make_request: #{ep_alive} -> #{ep_ready ? ep_ready: 'no endpoint'}"
			if ep_alive
				req = EndpointsProxy.build_coreapi_req(url_or_method, opts, ep_ready)
				start_time = Time.now
				response = nil
				begin
					@coreAPI_http.start do |http|
						response = http.request(req)
					end
				rescue Timeout::Error
					query_time = Time.now - start_time
					puts "Timeout after #{query_time} seconds"
					raise Timeout::Error
				end
				return response

			else # no endpoint is alive => we resort to uniprot for proteinInfo!!!
				if url_or_method == 'proteinInfo'
					ep_ready = opts[:uri].scan(/[^<].*[^>]/)[0]+'.xml'
	puts "endpoints.make_req!!! -> #{ep_ready}\n"

					url = URI.parse(ep_ready)
					req = Net::HTTP::Get.new(url.request_uri)
					res = Net::HTTP.start(url.host, url.port, @proxy_host, @proxy_port) {|http|
						http.request(req)
					}
	#				json_resp = @myProxy.uniprot2json(res.body, opts[:query]) # necessary to convert to OPS json
					res
				end # EO if proteinInfo

			end
		end


	end

end