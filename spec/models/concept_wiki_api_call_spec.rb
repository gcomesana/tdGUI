require "rspec"
require 'spec_helper'

describe ConceptWikiApiCall do

	before (:all) do
		@ops_wiki_api_call = ConceptWikiApiCall.new

		@url = 'http://staging.conceptwiki.org/web-ws/concept/search/byTag'
		@url = 'http://ops.conceptwiki.org/web-ws/concept/search/byTag' # last one
		@opts = {
			:uuid => 'eeaec894-d856-4106-9fa1-662b1dc6c6f1',
			:limit => 20,
			:offset => 0,
			:query => 'brca',
			:q => 'brca'
		}
	end


	it "it should exists" do
		@ops_wiki_api_call.should_not be_nil
	end



	it "make_request should return a valid Ruby Array from ops.conceptwiki" do
#		res = @conceptWiki.request(@url, @opts)
		@url = 'http://ops.conceptwiki.org/web-ws/concept/search/byTag'
		res = @ops_wiki_api_call.search_by_tag(@opts[:uuid],@opts[:q],{})
		res_bis = @ops_wiki_api_call.search_by_tag(@opts[:uuid],@opts[:q], @opts)
		res.should be_kind_of Array
		res.should be == res_bis

puts "#{res}"
	end


	it "make_request should return a valid Ruby Array from stagin.conceptwiki" do
	#		res = @conceptWiki.request(@url, @opts)
			res = @ops_wiki_api_call.search_by_tag(@opts[:uuid],@opts[:q],@opts)
			res.should be_kind_of Array
	puts "#{res}"
	end


	it "should try to get a url from a term or so" do
		res = @ops_wiki_api_call.search_for_url(@opts[:q], {})
		puts "#res:\n#{res}\n"

	end


end

