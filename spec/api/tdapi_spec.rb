require 'rspec'
require 'spec_helper'

require 'nokogiri'

describe TargetDossierApi do

	before :each do
		@accs = 'P08913,Q14596,Q5H943,P29274,-'
		@accs_only = 'P08913,Q14596,Q5H943,P29274'
		@uuids = 'd593db45-e954-4e97-94f7-c039350f97f4,ec79efff-65cb-45b1-a9f5-dddfc1c4025c,eeaec894-d856-4106-9fa1-662b1dc6c6f1,979f02c6-3986-44d6-b5e8-308e89210c8d,31dd02fa-3522-438e-bef5-da14902f6c1b'

		@api_prefix = '/api'
	end


	describe "Uniprot API" do
		it "/api/status.json should return the simplest json possible on request" do
			get "#{@api_prefix}/status.json"

			response.status.should == 200
			parsed_resp = JSON.parse(response.body)
			response.body.should be_kind_of(String)
			parsed_resp.should be_kind_of(Hash)
			parsed_resp['resp'].should_not be_nil

		end


		it "/.../multiple.<acc_1,acc_2,...>.json should return a json ready to use with ExtJs grid" do
			accs = @accs_only
			get "#{@api_prefix}/target/multiple/#{accs}.json"

			parsed_resp = JSON.parse(response.body)
			parsed_resp.should be_kind_of(Hash)
			# parsed_resp['ops_records'].should be_kind_of(Array)
			# parsed_resp['ops_records'].length.should > 0
			parsed_resp['entries'].should be_a_kind_of(Array)
			parsed_resp['entries'].length.should > 0
			parsed_resp['entries'][0].should be_a_kind_of(Hash)
		end


		it "should produce xml for multiple targets" do
			accs = @accs_only
			get "#{@api_prefix}/target/multiple/#{accs}.xml"

			response.status.should == 200
puts "#{response.body}\n"
			xmlDoc = Nokogiri::XML(response.body)
			xmlDoc.should_not be_nil

		end


		it "#{@api_prefix}/target/byname/<a name>.json should return a json with info about target" do
			get "#{@api_prefix}/target/byname/Breast%20cancer%20type%202%20susceptibility%20protein.json"

			response.status.should == 200
			parsed_resp = JSON.parse(response.body)
			parsed_resp.should be_kind_of(Hash)

		end


		it "/td/api/v1/uniprot/<accession> should be return a json with uniprot info about accesssion" do
			get "#{@api_prefix}/target/Q13362.json"

			response.status.should == 200
			parsed_resp = JSON.parse(response.body)
			parsed_resp.should be_kind_of(Hash)
			parsed_resp.keys.length.should > 0

			xmlDoc = Nokogiri::XML(response.body)
			xmlDoc.should_not  be_nil
			xmlDoc.errors.length.should > 0
		end


		it "should yield XML output as well for all previous requests" do
			get "#{@api_prefix}/target/Q13362.xml"
			response.status.should == 200
			xmlDoc = Nokogiri::XML(response.body)
			xmlDoc.should_not be_nil

			get "#{@api_prefix}/target/byname/Breast%20cancer%20type%202%20susceptibility%20protein.xml"
			response.status.should == 200
			xmlDoc.should_not be_nil

		end
	end


	describe "OPS APi" do

		it "lookup should get a list of entries from a term" do

		end
	end

end