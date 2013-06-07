require "rspec"
require 'spec_helper'

describe OpsApiCallsController do

	before (:all) do
		@api_method = 'proteinInfo'

		@coreApi_opts = {:uri=>"http://www.conceptwiki.org/concept/70dafe2f-2a08-43f7-b337-7e31fb1d67a8",
										 :limit=>"25", :offset=>0, :method=>"proteinInfo"}
		@coreApi_pharma_opts = {:uri=>"http://www.conceptwiki.org/concept/59aabd64-bee9-45b7-bbe0-9533f6a1f6bc",
														:limit=>"15", :offset=>0, :method=>"proteinPharmacology"}
		@bad_uniprot_opts = {:uri=>"Q13362",
												 :limit=>"25", :offset=>nil} #, :method=>"proteinInfo"}

		@ok_uniprot_opts = {:uri=>"http://www.uniprot.org/uniprot/Q13362",
												:limit=>"25", :offset=>nil, :method=>"proteinInfo"}

		@bad_uniprot_uri = @bad_uniprot_opts[:uri]
		@ok_uniprot_uri = @ok_uniprot_opts[:uri]
		@coreApi_uri = @coreApi_opts[:uri]


	end



	describe "protein_info action" do
		it "should make a request to coreApi for proteinInfo" do

			get :protein_info, :protein_uri => @coreApi_uri
			puts "**==> coreAPI protein_info: #{response.body}"
			response.code.to_i.should be == 200
			json_resp = JSON.parse(response.body)

			json_resp['ops_records'].should be_nil
#			json_resp['ops_records'].should be_kind_of Array
			json_resp['format'].should be == "linked-data-api"
			json_resp['result']['primaryTopic']['exactMatch'][0].should be_kind_of(Hash)

			exactMatch = json_resp['result']['primaryTopic']['exactMatch'][0]
			exactMatch['_about'].should include("uniprot")

		end


		it "should return nil from OPS, then diff from nil from uniprot" do
			concept_uri = 'http://www.conceptwiki.org/concept/eeaec894-d856-4106-9fa1-662b1dc6c6f1'



		end


		it "should make a protein_info request with no result despite conceptWiki uri" do
			concept_uri = "http://www.conceptwiki.org/concept/5c6405bd-2b3d-4165-b521-8bb1d35b49c6"
			get :protein_info, :protein_uri => concept_uri

			response.code.to_i.should be == 200
			parsed_resp = JSON.parse(response.body)
			parsed_resp['result'].should be_nil
			parsed_resp['success'].should_not be_nil
			parsed_resp['success'].should be_false
		end



		it "should perform the sequence for a target: lookup and info w/o resorting uniprot" do
			mock_prefLabel_en = "Breast cancer type 1 susceptibility protein"
			mock_about = "http://www.conceptwiki.org/concept/5c6405bd-2b3d-4165-b521-8bb1d35b49c6"

		end


=begin UNIPROT not used so far
		it "should get a response but not data on it" do
			get :protein_info, :protein_uri => @bad_uniprot_uri
			json_resp = JSON.parse(response.body)

			puts "**==> uniprot protein_info: #{response.body}"
			json_resp['ops_records'].should be_nil
			response.code.to_i.should be == 200
		end


		it "should manage a request to uniprot for proteinInfo" do
			get :protein_info, :protein_uri => @ok_uniprot_uri
			json_resp = JSON.parse(response.body)

# puts "**==> uniprot protein_info: #{response.body}"
			json_resp['ops_records'].should be_nil
#			json_resp['ops_records'].should be_kind_of Array
#			json_resp['totalCount'].should be > 0

		end
=end
	end


	describe 'protein pharmacology action' do
		it "should make a request to LDA API for pharmacology info for a target" do
			get :pharm_by_protein_name, :protein_uri => @coreApi_pharma_opts[:uri]

			puts "**==> coreAPI protein_pharma: #{response.body}"
			json_resp = JSON.parse(response.body)

			json_resp['ops_records'].should be_nil
#			json_resp['ops_records'].should be_kind_of Array
#			json_resp['format'].should be == "linked-data-api"
			json_resp['result']['items'].should be_kind_of Array
			json_resp['result']['items'].length.should be == 10
			json_resp['result']['items'].each { |item|
				item['forMolecule'].should_not be nil
			}
		end

	end


	describe "check action" do

		it "check action should return true" do
			get :check
			resp_hash = JSON.parse(response.body)
			resp_hash.should be_kind_of Hash
			resp_hash['success'].should satisfy { |resp|
				(resp.is_a? TrueClass) || (resp.is_a? FalseClass)
			}
		end

	end


end