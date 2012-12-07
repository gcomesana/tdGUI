require "rspec"
require 'spec_helper'

describe ConceptWikiApiCall do

	before (:all) do
		@conceptWiki = ConceptWikiApiCall.new

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
		@conceptWiki.should_not be_nil
	end



	it "make_request should return a valid Ruby Array from ops.conceptwiki" do
#		res = @conceptWiki.request(@url, @opts)
		@url = 'http://ops.conceptwiki.org/web-ws/concept/search/byTag'
		res = @conceptWiki.search_by_tag(@opts[:uuid],@opts[:q],@opts)
		res.should be_kind_of Array
puts "#{res}"
	end


	it "make_request should return a valid Ruby Array from stagin.conceptwiki" do
	#		res = @conceptWiki.request(@url, @opts)
			res = @conceptWiki.search_by_tag(@opts[:uuid],@opts[:q],@opts)
			res.should be_kind_of Array
	puts "#{res}"
		end

end

