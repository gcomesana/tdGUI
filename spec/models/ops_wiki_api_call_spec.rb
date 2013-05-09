require "rspec"
require 'spec_helper'

describe ConceptWikiApiCall do

	before (:all) do
		@ops_wiki_api_call = OpsWikiApiCall.new

		@url = 'http://staging.conceptwiki.org/web-ws/concept/search/byTag'
		@url = 'http://ops.conceptwiki.org/web-ws/concept/search/byTag' # pre-last one
		OPS_API_ID = '86bb218b'
		OPS_API_KEY = '29493600307b1fbd0cec49cbee447073'

		CONCEPT_WIKI_API_SEARCH_URL = "http://ops.conceptwiki.org/web-ws/concept/search/"
		CONCEPT_WIKI_API_GET_URL = "http://ops.conceptwiki.org/web-ws/concept/search/get"
																																		# CONCEPT_WIKI_API_BY_TAG_URL = "http://ops.conceptwiki.org/web-ws/concept/search/byTag"
		@url = "https://beta.openphacts.org/search/byTag?app_id=#{OPS_API_ID}&app_key=#{OPS_API_KEY}&q=xxxx"
		@opts = {
			:uuid => 'eeaec894-d856-4106-9fa1-662b1dc6c6f1',
			:limit => 20,
			:offset => 0,
			:query => 'brca',
			:q => 'brca',
			:format => 'json'
		}
	end


	it "it should exists" do
		@ops_wiki_api_call.should_not be_nil
	end



	it "make_request should return a valid Ruby Array from ops.conceptwiki" do
#		res = @conceptWiki.request(@url, @opts)
		# @url = 'http://ops.conceptwiki.org/web-ws/concept/search/byTag'
		res = @ops_wiki_api_call.search_by_tag(@opts[:uuid], @opts[:q], {})
		res_bis = @ops_wiki_api_call.search_by_tag(@opts[:uuid], @opts[:q], @opts)
		res.should be_kind_of Array
		res.length.should be > res_bis.length # when @opts are passed, limit is 20
		res[5..10].should be == res_bis[5..10]

		puts "#{res}"
	end



	it "make_request should return a valid Ruby Array from stagin.conceptwiki" do
		#		res = @conceptWiki.request(@url, @opts)
		res = @ops_wiki_api_call.search_by_tag(@opts[:uuid],@opts[:q],@opts)
		res.should be_kind_of Array
		puts "#{res}"
	end




=begin
	it "should try to get a url from a term or so" do
		res = @ops_wiki_api_call.search_for_url(@opts[:q], {})
		puts "#res:\n#{res}\n"

	end
=end

end

