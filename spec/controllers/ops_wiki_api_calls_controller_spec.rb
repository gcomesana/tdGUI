require "rspec"
require 'spec_helper'

describe OpsWikiApiCallsController do

	before (:all) do
		@substring = 'breast'
		# @substring = 'brca'
#		@substring = 'Ubiquitin carboxyl-terminal hydrolase 4'
#		@substring = CGI.escape(@substring)
	end


	it "test action should return ok" do
		get :test
		JSON.parse(response.body).should be_kind_of Hash
	end


	it "should response a valid JSON" do
		get :protein_lookup, :query => @substring

		puts "resp json: #{response.body}"
		response.code.to_i.should eq(200)
		JSON.parse(response.body).should be_kind_of Array

		parsed_resp = JSON.parse(response.body)
		parsed_resp.length.should be > 0
		parsed_resp[0].should be_kind_of(Hash)
		parsed_resp[0]['uuid'].should be_kind_of(String)
		(parsed_resp[0]['uuid'] == parsed_resp[1]['uuid']).should be_false
		(parsed_resp[0]['match'] != parsed_resp[0]['pref_label']).should be_true
	end


	it "should get a emtpy response" do
		@substring = 'lpad' # no results
		get :protein_lookup, :query => @substring

		response.code.to_i.should eq(200)
		JSON.parse(response.body).should be_kind_of Array

	end


	it "proteinLookup should not raise an exception" do
		@substring = 'mtor'

		get :protein_lookup, :query => @substring

		response.code.to_i.should eq(200)
		expect { JSON.parse(response.body) }.to_not raise_error

		JSON.parse(response.body).should be_kind_of Array
		puts "\n#{response.body}"
	end


	it "compound_lookup should return a list of compound entries" do
		@substring = 'histidine'
		@substring = 'tamoxifen'

		get :compound_lookup, :query => @substring

		response.code.to_i.should be == 200
		expect { JSON.parse(response.body) }.to_not raise_error

		JSON.parse(response.body).should be_kind_of Array
		parsed_resp = JSON.parse(response.body)
		parsed_resp.each {|item|
			item.should be_kind_of(Hash)
		}
		puts "\n#{response.body}"
	end

end