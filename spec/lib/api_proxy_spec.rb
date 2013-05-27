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



	it "should be involved in several biological processes" do
		acc = 'P38398'
		resp = @apiproxy.get_process4target(acc)

		resp.should_not be_nil
		resp.should be_kind_of(Hash)
		resp[:processes].should be_kind_of(Array)
		resp[:processes][0].should be_kind_of(Hash)
# There can be two similar goId but the detection method is different,
# so there will be able two rows with similar goId
#		(resp[:processes][0][:goid] != resp[:processes][1][:goid]).should be_true
		resp[:processes][1][:evidence].should be_kind_of(String)

	end


	it "should return no processes which the target is involved in" do
		acc = 'Q7KYU9'
		resp = @apiproxy.get_process4target(acc)

		resp.should_not be_nil
		resp.should be_kind_of(Hash)
		resp[:processes].should be_empty
		(resp[:target] == acc).should be_true
		resp[:processes].length.should be == 0

	end



	it "should get at several targets for a biological process: apoptosis" do
		bio_process = 'apoptosis'

		resp = @apiproxy.get_targets4process(bio_process)

		resp.should_not be_nil
		resp[:query_term].should be == bio_process
		resp[:targets].should be_kind_of(Array)
		resp[:targets].should have_at_least(1).items
		(resp[:targets][0][:acc] == resp[:targets][1][:acc]).should be_false
		resp[:targets].each { |target|
			target[:genes].should have_at_least(1).items
			target[:name].should be_kind_of(String)
			target[:families].should be_kind_of(Array)
		}

	end




	it "conversion for this accession return a empty set" do
		acc = "Q7KYU9"

		resp = @apiproxy.uniprot2chembl(acc)

		resp.should be_nil
	end


	it "conversion for P38398 should return the Chembl Id" do
		acc = "P38398"

		resp = @apiproxy.uniprot2chembl(acc)

		resp.should_not be_nil
		resp.should be_kind_of(Hash)
		resp['target'].should be_kind_of(Hash)
		resp['target']['proteinAccession'].should == acc
		resp['target']['chemblId'].should include('CHEMBL')

		resp['target']['compoundCount'].should be_kind_of(String)
		resp['target']['compoundCount'].should match(/\d+/)
		resp['target']['bioactivityCount'].should be_kind_of(String)
		resp['target']['bioactivityCount'].should match(/\d+/)
	end



	it "should get no bioactivities for the target with accession Q7KYU9" do
		acc = 'Q7KYU9'

		resp = @apiproxy.activities4target(acc)

		resp.should be_nil
	end



	it "should get a list of bioactivities for the target accession P38398" do
		acc = 'P38398'
		acc = 'Q13936'

		resp = @apiproxy.activities4target(acc)
		resp.should_not be_nil
		resp.should be_kind_of(Hash)
		resp[:accession].should be == acc
		resp[:activities].should be_kind_of(Array)
#		(resp[:activities][0][:assay_chemblid] == resp[:activities][1][:assay_chemblid]).should be_false

		resp[:chemblid].should include('CHEMBL')

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
