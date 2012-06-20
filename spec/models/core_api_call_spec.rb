require "rspec"
require 'spec_helper'


describe "should call uniprot" do

	before (:all) do
		@coreApi = CoreApiCall.new

		@api_method = 'proteinInfo'

		@coreApi_opts = {:uri=>"<http://www.conceptwiki.org/concept/979f02c6-3986-44d6-b5e8-308e89210c8d>",
						 :limit=>"25", :offset=>0, :method=>"proteinInfo"}
		@uniprot_opts = {:uri=>"<http://www.uniprot.org/uniprot/P08913>",
										 :limit=>"25", :offset=>nil} #, :method=>"proteinInfo"}

	end


	it "should exists" do
		@coreApi.should_not be_nil
	end


	it "should make a coreApi call" do
		res = @coreApi.request(@api_method, @coreApi_opts)

		res.should_not be_nil
		res.length.should be > 0
		res.should be_kind_of Array
puts ("Spec1: #{res[0].to_s}")
	end


	it "should make a uniprot call" do
		res = @coreApi.request(@api_method, @uniprot_opts)

		res.should_not be_nil
		res.length.should be > 0
		res.should be_kind_of Array
puts ("Spec2: #{res[0].to_s}")
	end

end