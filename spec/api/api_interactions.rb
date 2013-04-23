require 'rspec'
require 'spec_helper'

require 'nokogiri'

describe TargetDossierApi do

	before :each do
		@accs = 'P08913,Q14596,Q5H943,P29274,-'
		@uuids = 'd593db45-e954-4e97-94f7-c039350f97f4,ec79efff-65cb-45b1-a9f5-dddfc1c4025c,eeaec894-d856-4106-9fa1-662b1dc6c6f1,979f02c6-3986-44d6-b5e8-308e89210c8d,31dd02fa-3522-438e-bef5-da14902f6c1b'
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

		it "/api/status?param_test=<something>] should return a json with the param_test in it" do
			get "api/status.json?param_test=something"

			response.status.should == 200
			parsed_resp =	JSON.parse(response.body)
			response.body.should be_kind_of(String)
			parsed_resp.should be_kind_of(Hash)
			parsed_resp['resp'].should include('something')
		end


		it "/api/interactions/<accession> should get a json object filled with interactions" do
			get 'api/interactions/Q14596.json'

			response.status.should == 200
			parsed_resp =	JSON.parse(response.body)
			response.body.should be_kind_of(String)
			parsed_resp.should be_kind_of(Array)
			
			parsed_resp.length.should be > 0
			parsed_resp.length.should be > 5
		end


		it "/api/interactions/<acc1>/<acc2> should return a json with 0 interactions involving both acc's" do
			get 'api/interactions/Q14596/P29274.json'

			response.status.should == 200
			parsed_resp =	JSON.parse(response.body)
			response.body.should be_kind_of(String)
			parsed_resp.should be_kind_of(Hash)
			parsed_resp['totalCount'].should be == 0
#			puts "totalCount: #{parsed_resp['totalCount']}\n"
		end


		it "/api/interactions/<acc1>/<acc2> should return a json with interactions involving both acc's" do
			get 'api/interactions/Q12420/P15442.json'

			response.status.should == 200
			parsed_resp =	JSON.parse(response.body)
			response.body.should be_kind_of(String)
			parsed_resp.should be_kind_of(Hash)
			
			parsed_resp['totalCount'].should be >= 0
#			puts "totalCount: #{parsed_resp['totalCount']}\n"

			parsed_resp['interactions'].should be_kind_of(Array)
			parsed_resp['interactions'][0]['detection_method'].should be_kind_of(Hash)
			parsed_resp['interactions'][1]['interaction_type'].should be_kind_of(Hash)
			parsed_resp['interactions'][2]['interaction_type'].length.should be == 2

		end

		it "/api/interactions/<acc1>/<acc2> should return a json with interactions involving both acc's and threshold" do
			get 'api/interactions/Q12420/P15442.json?threshold=0.21'

			response.status.should == 200
			parsed_resp =	JSON.parse(response.body)
			response.body.should be_kind_of(String)
			parsed_resp.should be_kind_of(Hash)
			
			parsed_resp['totalCount'].should be >= 3
#			puts "totalCount: #{parsed_resp['totalCount']}\n"

			parsed_resp['interactions'].should be_kind_of(Array)
			parsed_resp['interactions'][0]['detection_method'].should be_kind_of(Hash)
			parsed_resp['interactions'][1]['interaction_type'].should be_kind_of(Hash)
			parsed_resp['interactions'][2]['interaction_type'].length.should be == 2
			puts "parsed_resp: #{parsed_resp.to_json.to_s}\n"
		end


	end # EO describe

end # EO main describe