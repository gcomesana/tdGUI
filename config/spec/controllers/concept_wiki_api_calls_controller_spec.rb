require "rspec"
require 'spec_helper'

describe ConceptWikiApiCallsController do

	before (:all) do
		@substring = 'breast'
	end


	it "test action should return ok" do
			get :test
			JSON.parse(response.body).should be_kind_of Hash
	end


	it "should response a valid JSON" do
		get :protein_lookup, :query => @substring

		response.code.to_i.should eq(200)
		JSON.parse(response.body).should be_kind_of Array

	end


	it "should get a emtpy response" do
		@substring = 'lpad' # no results
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


end