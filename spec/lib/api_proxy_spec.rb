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
		resp[:query_term].should be == disease
		resp[:targets].should have_at_least(10).items

		resp[:targets][0].should be_kind_of Hash
		resp[:targets][1][:acc].should be_kind_of String
		resp[:targets][1][:genes].should be_kind_of Array

	end


	it "should get a ruby hash structure straight from an entry search at OMIM" do
		disease = 'asthma'
		resp = @apiproxy.get_omim4disease(disease, 0, 10)

		true.should be == true
	end


	it "should get a ruby structure from a geneMap search on OMIM" do
		disease = 'asthma'
		resp = @apiproxy.get_omim4disease(disease, 0, 10)

		resp.should be_kind_of Hash
# 		resp['omim']['searchResponse']['entryList']['entry'].should be_kind_of Array
		resp[:omim][:query_term].should be == disease
		resp[:omim][:phenotype_list].should be_kind_of Array
		resp[:omim][:phenotype_list].should have_at_least(1).items
		resp[:omim][:phenotype_list][0].should be_kind_of Hash
	end



	it "should get a list of entries from OMIM for query search asthma" do
		disease = 'avian+flu'
		disease = 'asthma'
		resp = @apiproxy.omim_disease_lookup(disease, 0, 10)

		resp.should_not be_nil
		resp.should be_kind_of(Array)
		resp.length.should be > 0
		resp[0].should be_kind_of(Hash)

	end


=begin
	it "should get a ruby hash from a OMIM number for a disease with just one gene" do
		mim_number = '609958'
		resp = @apiproxy.omim_entry_info(mim_number)

		resp.should_not be_nil
		resp.should be_kind_of(Hash)
		resp['label'].should be_kind_of(String)
		resp['genes'].should be_kind_of(Array)
		resp['genes'].length.should be == 1

	end
=end

	it "should get a ruby hash from a OMIM number for a disease" do
		mim_number = '600807'
		resp = @apiproxy.omim_entry_info(mim_number)

		resp.should_not be_nil
		resp.should be_kind_of(Hash)
		resp['label'].should be_kind_of(String)
		resp['genes'].should be_kind_of(Array)
		resp['genes'].length.should be > 1
		resp['genes'][0].should be_kind_of(Hash)
		resp['genes'][1]['mim_number'].should_not be_nil

	end
end
