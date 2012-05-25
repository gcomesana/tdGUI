require "rspec"
require 'spec_helper'

describe ConceptWikiApiCall do

	before (:all) do
		@conceptWiki = ConceptWikiApiCall.new

		@url = 'http://staging.conceptwiki.org/web-ws/concept/search/byTag'
		@opts = {
			:uuid => 'eeaec894-d856-4106-9fa1-662b1dc6c6f1',
			:limit => 20,
			:offset => 0,
			:query => 'brca2',
			:q => 'brca2'
		}
	end


	it "it should exists" do
		@conceptWiki.should_not be_nil
	end


	it "should test should be true" do
#		testResult = @conceptWiki.send(:test)
		testResult = @conceptWiki.testCW
		testResult.should be true
	end


	it "make_request should return a valid Ruby Array" do
		res = @conceptWiki.request(@url, @opts)
		res.should be_kind_of Array
puts "#{res}"
	end

end

