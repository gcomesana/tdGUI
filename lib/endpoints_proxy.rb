

# TODO movidas con los endpoints de aqui y de innerproxy...
require 'inner_proxy.rb'
require 'net/http'
require 'uri'
module EndpointsProxy

	private
	@myProxy = InnerProxy.new



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
			ep_alive = checkConceptAPI
			ep_ready = getEndpoint
#			ep_ready = 'http://www.uniprot.org/uniprot/?format=tab&columns=id,protein%20names,citation,comments,genes&sort=score'

			if url.include? ep_ready then # conceptAPI will be called
				url = URI.parse(url)
				response = Net::HTTP.post_form(url, opts)
# puts "make_request conceptWiki:\n#{response.inspect}"
				response

			else # so far, protein_lookup via uniprot
				ep_ready = ep_ready + "&query="+opts[:query]+'+AND+organism:9606'
				url = URI.parse(ep_ready)

				req = Net::HTTP::Get.new(url.request_uri)
				res = Net::HTTP.start(url.host, url.port) {|http|
					http.request(req)
				}
# puts "make_request uniprot:\n#{res.body}"
				json_resp = @myProxy.uniprot2json(res.body, opts[:query]) # necessary to convert to OPS json
				res

			end

		elsif url.include? @myProxy.coreApiEP then # coreAPI on
			ep_alive = checkCoreAPI
			ep_ready = getEndpoint

			if url.include? ep_ready then
				uri = URI.parse(url)
				http = Net::HTTP.new(uri.host, uri.port)
				nil

			end
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