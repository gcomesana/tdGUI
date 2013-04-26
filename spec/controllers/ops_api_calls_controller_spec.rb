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
			json_resp = JSON.parse(response.body)

			json_resp['ops_records'].should be_nil
#			json_resp['ops_records'].should be_kind_of Array
			json_resp['format'].should be == "linked-data-api"

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