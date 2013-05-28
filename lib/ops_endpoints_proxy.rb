

require 'inner_proxy.rb'
require 'net/http'
require 'uri'

# Set the correct endpoint to call on every request, depending whether or not
# the endpoints are alive
module OpsEndpointsProxy

	private
	@myProxy = InnerProxy.new

# squid proxy parameters
	@proxy_host = 'ubio.cnio.es'
	@proxy_port = 3128

	OPS_API_ID = '86bb218b'
	OPS_API_KEY = '29493600307b1fbd0cec49cbee447073'

#	URI_REGEX = /^(?=[^&])(?:(?<scheme>[^:\/?#]+):)?(?:\/\/(?<authority>[^\/?#]*))?(?<path>[^?#]*)(?:\?(?<query>[^#]*))?(?:#(?<fragment>.*))?/
	URI_REGEX =	/(http|https):\/\/[\w\-_]+(\.[\w\-_]+)+([\w\-\.,@?^=%&amp;:\/~\+#]*[\w\-\@?^=%&amp;\/~\+#])?/

	OPS_API_URL = 'https://beta.openphacts.org/'
	OPSAPI_TARGET_URL = 'https://beta.openphacts.org/target' # 'http://api.openphacts.org/target'
	OPSAPI_PHARMA_URL = 'http://beta.openphacts.org/target/pharmacology/pages' # 'http://api.openphacts.org/target/pharmacology/pages'
	OPSAPI_PHARMA_COUNT_URL = 'http://beta.openphacts.org/target/pharmacology/count'
	OPSAPI_PHARMA_PAGE_RESULTS = 'http://beta.openphacts.org/target/pharmacology/pages'

	CONCEPTWIKI_CONCEPT_URI = 'http://www.conceptwiki.org/concept/'
	CONCEPT_WIKI_TP53_UUID = '62bf09e5-4909-4de8-b18d-885f95cdb3e4'

	TIMEOUT = 2.5 # arbitrary timeout to ping endpoints

	UNIPROT_PROTEIN_LOOKUP = 'http://www.uniprot.org/uniprot/?query=organism:9606+AND+xxxx&format=tab&columns=id,protein%20names,citation,comments,genes&sort=score&limit=25'
	UNIPROT_PROTEIN_LOOKUP_SHORT = 'http://www.uniprot.org/uniprot/?format=tab&columns=id,protein%20names,citation,comments,genes&sort=score&limit=25'
	UNIPROT_PROTEIN_INFO ='http://www.uniprot.org/'

	URL_FETCH_ENTRY = 'http://www.uniprot.org/uniprot/'

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
		# result = @myProxy.check_OPS_api
		uri_param = CGI.escape(CONCEPTWIKI_CONCEPT_URI+CONCEPT_WIKI_TP53_UUID)
		ops_api_fulluri = OPSAPI_TARGET_URL + "?uri=#{uri_param}"
		ops_api_fulluri = ops_api_fulluri + "&app_id=#{OPS_API_ID}&app_key=#{OPS_API_KEY}"

		alive = 0
		@endpoint_ready = nil

		result = @myProxy.request(ops_api_fulluri)
		alive = result.code.to_i
		if alive > 0
			@endpoint_ready = OPSAPI_TARGET_URL # any of them from 83 to 87
		end

		result = alive > 0 ? true : false

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
	def self.make_request_old (url_or_method, opts)
# check if OPS published endpoints are alive, otherwise use uniprot :-S
		# concept_wiki_ok = check_conceptwiki
		concept_wiki_ok = true
		ops_api_ok = check_ops_api()
		api_endpoints_ok = concept_wiki_ok && ops_api_ok

# check if url_or_method is an url or a method like protinInfo, compoundInfo,...
		uri_parts = url_or_method.scan(URI_REGEX)[0]
		is_uri = uri_parts.nil? == false && uri_parts.select {|uri| uri.nil? == false}.length > 0
		url = ""

# build up the requests, depending on guards above
		if api_endpoints_ok
			if is_uri

=begin
				if url_or_method.include?(@myProxy.conceptwiki_ep_search)
					branch = ''
					branch = "&branch=#{opts[:branch]}" unless opts[:branch].nil?
					url = url_or_method + "?uuid=#{opts[:uuid]}&q=#{opts[:query]}#{branch}"
				end

				if url_or_method.include?(@myProxy.conceptwiki_ep_get)
					url = url_or_method + "?uuid=#{opts[:uuid]}"
				end
=end
				url = url_or_method + "?uuid=#{opts[:uuid]}"

			else # url_or_method is method... proteinInfo, ...
				if url_or_method == 'proteinInfo' || url_or_method == 'proteinPharmacology' then
					url = url_or_method == 'proteinInfo'? @myProxy.ops_api_target: @myProxy.ops_api_target_pharma
					url = url + "?_format=json&uri="
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
		puts "def url: #{url}"
		@myProxy.request(url)


	end




	# Make a request
	# @param the_url will be an REST url...
	def self.make_request(the_url, opts)
		concept_wiki_ok = true
		ops_api_ok = check_ops_api()
		api_endpoints_ok = concept_wiki_ok && ops_api_ok

# check if url_or_method is an url or a method like protinInfo, compoundInfo,...
#		uri_parts = the_url.scan(URI_REGEX)[0]
#		is_uri = uri_parts.nil? == false && uri_parts.select {|uri| uri.nil? == false}.length > 0
		url = the_url

# build up the requests, depending on guards above
		if api_endpoints_ok && the_url.index('uniprot').nil? # API is on
			if opts[:uuid].nil? == false
				if the_url.index('&').nil?
					url = the_url + "?uuid=#{opts[:uuid]}"
				else
					url = the_url + "&uuid=#{opts[:uuid]}"
				end
			end


			if opts[:uri].nil? == false
				uri_unencoded = CGI::unescape(opts[:uri]) == opts[:uri]
				esc_uri = uri_unencoded ? CGI::escape(opts[:uri]) : opts[:uri]
				url = url + "&uri=#{esc_uri}"
			end

			if opts[:q].nil? == false
				query_term_encoded = CGI::unescape(opts[:q]) == opts[:q]
				escaped_qry = query_term_encoded ? CGI::escape(opts[:q]): opts[:q]
				url = url + "&q=#{escaped_qry}"

			elsif opts[:query].nil? == false
				query_term_encoded = CGI::unescape(opts[:query]) == opts[:query]
				escaped_qry = query_term_encoded ? CGI::escape(opts[:query]): opts[:query]
				url = url + "&q=#{escaped_qry}"
			end

			if the_url.index('_format').nil?
				url = url + "&_format=#{opts[:format].nil? ? 'json': opts[:format]}"
			end

			# limit_param = opts[:limit].nil? ? 10: opts[:limit]
			url = url + (opts[:limit].nil? == false ? "&limit=#{opts[:limit]}": '')

		else # we gotta resort to uniprot and derivatives, this is only to get proteins
			if the_url.include?(@myProxy.conceptwiki_ep_search)
				ep_ready = get_concept_endpoint()
				url = ep_ready + "&query="+opts[:query]+'+AND+organism:9606'
			end

		end

		puts "ops_endpoints_proxy.make_request is #{url}"
		resp = @myProxy.request(url)
		resp
=begin
		if the_url.index('uniprot').nil? == false
			@myProxy.proteinInfo2hash(resp.body)
		end
=end
	end




end