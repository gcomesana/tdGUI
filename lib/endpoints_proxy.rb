

require 'inner_proxy.rb'
require 'net/http'
require 'uri'

# Set the correct endpoint to call on every request, depending whether or not
# the endpoints are alive
module EndpointsProxy

private
	@myProxy = InnerProxy.new

# squid proxy parameters
	@proxy_host = 'ubio.cnio.es'
	@proxy_port = 3128

#	URI_REGEX = /^(?=[^&])(?:(?<scheme>[^:\/?#]+):)?(?:\/\/(?<authority>[^\/?#]*))?(?<path>[^?#]*)(?:\?(?<query>[^#]*))?(?:#(?<fragment>.*))?/
  URI_REGEX =	/(http|https):\/\/[\w\-_]+(\.[\w\-_]+)+([\w\-\.,@?^=%&amp;:\/~\+#]*[\w\-\@?^=%&amp;\/~\+#])?/


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


	def self.protein_info_req (uuid)
		url = @myProxy.conceptwiki_ep+"/get?uuid=#{uuid}"
		url = URI.parse(url) rescue url
		http = Net::HTTP.new(url.host, url.port)
		req = Net::HTTP::Get.new(url.request_uri)
		begin
			response = Timeout::timeout(InnerProxy::TIMEOUT) {
				http.request(req)
			}
			response
		rescue Timeout::Error
			nil
		end
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
	def self.check_conceptwiki ()

		result = @myProxy.check_conceptwiki()
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


	def self.check_ops_api ()
		result = @myProxy.check_OPS_api
		result
	end


# Gets the core endpoint which is alive to make requests to it.
# The core endpoint is kind of OPSAPI target url
# @return [String] the address of the endpoint
	def self.get_core_endpoint
		@myProxy.core_endpoint_ready
	end


# Gets the endpoint which is to be used to get information about a concept.
# The default endpoint is conceptWiki; if conceptWiki (or coreAPI) are not alive
# a uniprot endpoint is returned
# @return [String] the endpoint which the concept requests are going to be
	def self.get_concept_endpoint
		status = @myProxy.check_OPS_api # @myProxy.checkCoreAPI

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



# All requests should pass through here. The sequence of the requests are:
# - get a concept with conceptwiki...byTag?q=term
# - on adding a term, /tdgui_proxy/get_uniprot_by_name, but the method
# ops.conceptwiki.../web-ws/concept/get?uuid:<uuid> can be preferred
# - on search terms, tdgui_proxy/multiple_entries_retrieval is called (it can not
# be replaced as there is no counterpart in OPS api)
# - on double click, proteinInfo is called, now as method: proteinInfo, options
# with conceptwiki url for the target. now this has to be done with like
# - interactions information remains as it follows as gets from local
# - pharma info has to be done through OPS API + LDA components
#
# So, to
# make a request to conceptwiki or api.openphacts.org, depending:
# - if url is conceptwiki.org, search for term and
#		- check for conceptwiki and api.openphacts alive
#		- if isCheckOK:
#			  do a request like
# 		  http://ops.conceptwiki.org/web-ws/concept/search/byTag?q=term&uuid=opts[:uuid]
#   - else
# 			do a uniprot request
#
# - if url is not well-formed
#		- check for conceptwiki and api.openphacts alive (again)
#   - if isCheckOK:
# 			if proteinInfo do a request
#					http://ops.conceptwiki.org/web-ws/concept/get?uuid=[uuid]
#				else
#					do a uniprot request
#
#
	def self.make_request (url_or_method, opts)
# check if OPS published endpoints are alive, otherwise use uniprot :-S
		concept_wiki_ok = check_conceptwiki
		ops_api_ok = check_ops_api()
		api_endpoints_ok = concept_wiki_ok && ops_api_ok

# check if url_or_method is an url or a method like protinInfo, compoundInfo,...
		uri_parts = url_or_method.scan(URI_REGEX)[0]
		is_uri = uri_parts.nil? == false && uri_parts.select {|uri| uri.nil? == false}.length > 0
		url = ""

# build up the requests, depending on guards above
		if api_endpoints_ok
			if is_uri
				if url_or_method.include?(@myProxy.conceptwiki_ep_search)
					url = url_or_method + "?uuid=#{opts[:uuid]}&q=#{opts[:query]}"
				end

				if url_or_method.include?(@myProxy.conceptwiki_ep_get)
					url = url_or_method + "?uuid=#{opts[:uuid]}"
				end

			else # url_or_method is method... proteinInfo, ...
				if url_or_method == 'proteinInfo'
					url = @myProxy.ops_api_target + "?_format=json&uri="
					conceptwiki_uri = opts[:uri].scan(/[^<].*[^>]/).length == 0 ?
										opts[:uri]:
										opts[:uri].scan(/[^<].*[^>]/)[0]

					url = url + CGI.escape(conceptwiki_uri)
				end

			end # EO is_uri

		else # !api_endpoints_ok
			if is_uri
				if url_or_method.include?(@myProxy.conceptwiki_ep_search)
					ep_ready = get_concept_endpoint()
					url = ep_ready + "&query="+opts[:query]+'+AND+organism:9606'
				end

				if url_or_method.include?(@myProxy.conceptwiki_ep_get)
					# the request has to be done to /tdgui_proxy/get_uniprot_by_name
					tdgui_proxy = TdguiProxy.new
					puts "NOT IMPLEMENTED!!! supossed to use a conceptwiki get"
				end
			else # url_or_method is method...
				url = opts[:uri].scan(/[^<].*[^>]/)[0]+'.xml'
			end
		end

#		my_url = URI.parse(url) rescue URI.parse(URI.encode(url)) rescue url

		@myProxy.request(url)


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
	def self.make_request_bis (url_or_method, opts)
puts ("make_request (#{url_or_method.to_s}, opts=#{opts.to_s})")

		# proteinInfo call conversion to request to ops.conceptwiki.org/concept/get?...
		if url_or_method.eql?('proteinInfo') && opts[:uri].include?(@myProxy.conceptwiki_ep)
			the_uri = opts[:uri]
			uuid = the_uri.slice(the_uri.rindex('/')+1, the_uri.length)
			response = EndpointsProxy.protein_info_req(uuid)

			return response
		end

		# decode url_or_method param
		uri_parts = url_or_method.scan(URI_REGEX)[0]
		is_uri = !uri_parts.nil? && !uri_parts[0].nil? &&
							!uri_parts[1].nil? && !uri_parts[2].nil?

# conceptWiki part
#		if is_uri || url_or_method.include?(@myProxy.conceptwiki_ep) then # conceptAPI
		if is_uri && url_or_method.include?(@myProxy.conceptwiki_ep)
puts "Attacking conceptWiki part"
# don't check endpoints for conceptwiki as they were checked concept_wiki_api_call
			ep_alive = check_ops_api() # check_coreAPI()
			ep_ready = get_concept_endpoint()
#			ep_ready = 'http://www.uniprot.org/uniprot/?format=tab&columns=id,protein%20names,citation,comments,genes&sort=score'

			if ep_alive && url_or_method.include?(ep_ready)  # conceptAPI will be called
				url = url_or_method + "?uuid=#{opts[:uuid]}&q=#{opts[:q]}"
				url = URI.parse(url) rescue url
				http = Net::HTTP.new(url.host, url.port)
				req = Net::HTTP::Get.new(url.request_uri)
				begin
					response = Timeout::timeout(InnerProxy::TIMEOUT) {
						http.request(req)
					}
				rescue Timeout::Error
					nil
				end
				response

			else # so far, protein_lookup via UNIPROT
				ep_ready = ep_ready + "&query="+opts[:query]+'+AND+organism:9606'
puts "EndpointsProxy.make_request: #{ep_ready}"
#				ep_ready = CGI.escape(ep_ready)
				url = URI.parse(ep_ready) rescue ep_ready

				req = Net::HTTP::Get.new(url.request_uri)
#				res = Net::HTTP.start(url.host, url.port, @proxy_host, @proxy_port) {|http|
				res = Net::HTTP.start(url.host, url.port) {|http|
					http.request(req)
				}
				json_resp = @myProxy.uniprot2json(res.body, opts[:query]) # necessary to convert to OPS json
				res

			end

# coreAPI part: proteinInfo, pharmaByTargetInfo, ...
		else # url_or_method should be something like 'proteinInfo', 'compoundPharma', 'sparql'
puts "Attacking coreApi part...coreAPIok? #{check_ops_api()}\n"
			ep_alive = check_ops_api() # check_coreAPI()
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

#					if ep_ready.include? "uniprot"
						url = URI.parse(ep_ready)
						req = Net::HTTP::Get.new(url.request_uri)
						res = Net::HTTP.start(url.host, url.port) {|http|
							http.request(req)
						}
		#				json_resp = @myProxy.uniprot2json(res.body, opts[:query]) # necessary to convert to OPS json
						res
				end # EO if proteinInfo

			end # EO ep_alive
		end # EO first if
	end # EO method

end