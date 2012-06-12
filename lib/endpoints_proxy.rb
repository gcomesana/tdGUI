

# EndpointsProxy class
# Set the correct endpoint to call on every request, depending whether or not
# the endpoints are alive
require 'inner_proxy.rb'
require 'net/http'
require 'uri'
module EndpointsProxy

private
	@myProxy = InnerProxy.new


# build_coreapi_req
# build a request POST object in order to make a further call to coreAPI from
# api_method and options
# @param api_method, the api method to be called by coreAPI
# @param opts, options for the call
# @return a Net::HTTP::Post object
	def build_coreapi_req (api_method, options)

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
		# we store the settings for a possible later call
		if not options[:named_graph_uri].nil? then
			@named_graph_uri = options[:named_graph_uri]
		end
		if not options[:default_graph_uri] then
			@default_graph_uri = options[:default_graph_uri]
		end

puts "\nIssues call to coreAPI on #{@uri.inspect} with options: #{options.inspect}\n"

		request = Net::HTTP::Post.new(@uri.path)
		# Tweak headers, removing this will default to application/x-www-form-urlencoded
		request["Content-Type"] = "application/json"
		request.form_data = options

		request
	end




	def self.buildup_uniprot_info (results)
		@myProxy.proteinInfo2hash(results)
	end



public

	def self.uniprot2json (uniprot_res, query)
		@myProxy.uniprot2json(uniprot_res, query)
	end



# Ping for conceptWiki API endpoint
# Calls the checkConceptWiki method of InnerProxy inner class
# Returns true if conceptWiki endpoint is up and usable; false otherwise
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
	def self.checkCoreAPI ()
#		@myProxy = InnerProxy.new
		result = @myProxy.checkCoreAPI()
		result
	end


	def self.getEndpoint
		@myProxy.coreEndpointReady
	end


	def self.getEndpointsChecked
		@myProxy.coreEndpointsChecked
	end


	def self.autocheck
		return true
	end



# make_request
# Make a request to the proper url by checking and setting the right endpoints
# in advance to make the request
# @param url, the url to check and decide whether or not is the right url to perform the request
# @param opts, the options to pass to the request
	def self.make_request (url, opts)

		if url.include? @myProxy.conceptWikiEP then # conceptAPI
			ep_alive = checkConceptAPI()
			ep_ready = getEndpoint()
#			ep_ready = 'http://www.uniprot.org/uniprot/?format=tab&columns=id,protein%20names,citation,comments,genes&sort=score'

			if url.include? ep_ready then # conceptAPI will be called
				url = URI.parse(url)
				response = Net::HTTP.post_form(url, opts)
# puts "make_request conceptWiki:\n#{response.inspect}"
				response

			else # so far, protein_lookup via uniprot
				ep_ready = ep_ready + "&query="+opts[:query]+'+AND+organism:9606'
puts "EndpointsProxy.make_request: #{ep_ready}"
				url = URI.parse(ep_ready)

				req = Net::HTTP::Get.new(url.request_uri)
				res = Net::HTTP.start(url.host, url.port) {|http|
					http.request(req)
				}
				json_resp = @myProxy.uniprot2json(res.body, opts[:query]) # necessary to convert to OPS json
				res

			end
# coreAPI part
		elsif url.include? @myProxy.coreApiEP then # coreAPI on
			ep_alive = checkCoreAPI()
			ep_ready = getEndpoint()

			if url.include? ep_ready then # coreAPI will be used
				req = build_coreapi_req(url, opts)
				start_time = Time.now
				response = nil
				begin
					http.start do |http|
						response = http.request(request)
					end
				rescue Timeout::Error
					query_time = Time.now - start_time
					puts "Timeout after #{query_time} seconds"
					raise Timeout::Error
				end

				resutsHash = buildup_uniprot_info(response.body)

			end
=begin
			if url.include? ep_ready then
				uri = URI.parse(url)
				http = Net::HTTP.new(uri.host, uri.port)
				nil
			end
=end
		end


	end




=begin
#		url = 'http://www.uniprot.org/uniprot/'
		options = {
			:query => 'organism:9606+AND+some'
#			'format' => 'tab',
#			'columns' => "id,protein%20names,citation,comments,genes"
		}
=end

=begin
	class InnerProxy
	...
	end
=end

end