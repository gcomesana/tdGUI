require "rspec"
require 'spec_helper'

describe APIProxy do

	before(:all) do
		@apiproxy = APIProxy.new
	end


	it "should get targets for asthma disease from uniprot" do
		disease = 'asthma'
		resp = @apiproxy.get_targets4disease(disease, 0, 10)
		resp.should be_kind_of Hash
		resp[:process_term].should be == disease
		resp[:targets].should have_at_least(1).items

		resp[:targets][0].should be_kind_of Hash

	end


	it "should get a ruby hash structure straight from an entry search at OMIM" do
		disease = 'asthma'
		resp = @apiproxy.get_omim4disease(disease, 10)

		resp.should be_kind_of Hash
		resp['omim']['searchResponse']['entryList']['entry'].should be_kind_of Array
	end


	it "should get a ruby structure from a geneMap search on OMIM" do
		disease = 'asthma'
		resp = @apiproxy.get_omim4disease(disease, 10)

		resp.should be_kind_of Hash
	end
end
