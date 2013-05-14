
require 'rspec'
require 'spec_helper'

require 'nokogiri'

describe TargetDossierApi do

	before :each do
		@accs = 'P08913,Q14596,Q5H943,P29274,-'
		@uuids = 'd593db45-e954-4e97-94f7-c039350f97f4,ec79efff-65cb-45b1-a9f5-dddfc1c4025c,eeaec894-d856-4106-9fa1-662b1dc6c6f1,979f02c6-3986-44d6-b5e8-308e89210c8d,31dd02fa-3522-438e-bef5-da14902f6c1b'

		@api_prefix = '/pharma'
	end


	describe "Interctions api" do

		it "/api/status.json should return a json with nil as testParam" do
			get "api/status.json"

			response.status.should == 200
			parsed_resp =	JSON.parse(response.body)
			response.body.should be_kind_of(String)
			parsed_resp.should be_kind_of(Hash)
			parsed_resp['resp'].should include("nil")

		end
	end


	describe "OMIM funcitions: " do
		it "/pharma/disease/by_name.json should return a list of diseases" do
			mock_disease = 'asthma'
			get "#{@api_prefix}/disease/by_name.json?disease=#{mock_disease}&limit=15"

			response.status.should == 200
			parsed_resp = JSON.parse(response.body)
			parsed_resp.should be_kind_of(Array)
			parsed_resp.length.should be > 0
			parsed_resp[0].should be_kind_of(Hash)
			parsed_resp[0]['pref_url'].should include('omim')
			parsed_resp[1]['uuid'].length.should be > 0
			(parsed_resp[1]['uuid'] == parsed_resp[2]['uuid']).should be_false

		end
	end
end
