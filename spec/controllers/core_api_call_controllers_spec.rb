require "rspec"
require 'spec_helper'

describe CoreApiCallsController do

	before (:all) do
		@api_method = 'proteinInfo'

		@coreApi_opts = {:uri=>"http://www.conceptwiki.org/concept/70dafe2f-2a08-43f7-b337-7e31fb1d67a8",
						 :limit=>"25", :offset=>0, :method=>"proteinInfo"}
		@uniprot_opts = {:uri=>"Q13362",
										 :limit=>"25", :offset=>nil} #, :method=>"proteinInfo"}

		@uniprot_uri = @uniprot_opts[:uri]
		@coreApi_uri = @coreApi_opts[:uri]
	end


	it "check action should return true" do
		get :check
		resp_hash = JSON.parse(response.body)
		resp_hash.should be_kind_of Hash
		resp_hash['success'].should be_true


	end


=begin
	it "should make a test" do
		get :test
		JSON.parse(response.body).should be_kind_of Hash
	end
=end


	it "should make a request to coreApi for proteinInfo" do
		get :protein_info, :protein_uri => @coreApi_uri
 		json_resp = JSON.parse(response.body)

		json_resp['ops_records'].should_not be_nil
		json_resp['ops_records'].should be_kind_of Array
		json_resp['totalCount'].should be > 0

#		puts "**==> coreAPI protein_info: #{response.body}"
	end


	it "should manage a request to uniprot for proteinInfo" do
		get :protein_info, :protein_uri => @uniprot_uri
		json_resp = JSON.parse(response.body)

puts "**==> uniprot protein_info: #{response.body}"
		json_resp['ops_records'].should_not be_nil
		json_resp['ops_records'].should be_kind_of Array
		json_resp['totalCount'].should be > 0

	end


	it "should make a checkCoreApi before proteinLookup" do
		get :check

		resp_hash = JSON.parse(response.body)
		status = resp_hash[:success]

		if status == true then
			# coreApi req
			puts 'call coreApi req as at least one endpoint is alive'

		else
			# uniprot req
			puts 'call uniprot req as no endpoint is alive'
		end


	end


=begin
	it "should response a valid JSON" do
		get :protein_lookup, :query => @substring

		response.code.to_i.should eq(200)
		JSON.parse(response.body).should be_kind_of Array

	end

	it "proteinLookup should not raise an exception" do
		get :protein_lookup, :query => @substring

		response.code.to_i.should eq(200)
		expect { JSON.parse(response.body) }.to_not raise_error
puts "\n#{response.body}"
	end
=end

end