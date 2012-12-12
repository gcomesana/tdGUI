require "rspec"
require 'spec_helper'

describe CoreApiCallsController do

	before (:all) do
		@api_method = 'proteinInfo'

		@coreApi_opts = {:uri=>"http://www.conceptwiki.org/concept/70dafe2f-2a08-43f7-b337-7e31fb1d67a8",
						 :limit=>"25", :offset=>0, :method=>"proteinInfo"}
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
			json_resp = JSON.parse(response.body)

			json_resp['ops_records'].should_not be_nil
			json_resp['ops_records'].should be_kind_of Array
			json_resp['totalCount'].should be > 0

	#		puts "**==> coreAPI protein_info: #{response.body}"
		end


		it "should get a response but not data on it" do
			get :protein_info, :protein_uri => @bad_uniprot_uri
			json_resp = JSON.parse(response.body)

#	puts "**==> uniprot protein_info: #{response.body}"
			json_resp['ops_records'].should be_nil
			response.code.to_i.should be == 200
		end


		it "should manage a request to uniprot for proteinInfo" do
			get :protein_info, :protein_uri => @ok_uniprot_uri
			json_resp = JSON.parse(response.body)

# puts "**==> uniprot protein_info: #{response.body}"
			json_resp['ops_records'].should_not be_nil
			json_resp['ops_records'].should be_kind_of Array
			json_resp['totalCount'].should be > 0

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