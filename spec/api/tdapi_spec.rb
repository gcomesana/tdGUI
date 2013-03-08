require 'rspec'
require 'spec_helper'

require 'nokogiri'

describe TargetDossierApi do

	before :each do
		@accs = 'P08913,Q14596,Q5H943,P29274,-'
		@uuids = 'd593db45-e954-4e97-94f7-c039350f97f4,ec79efff-65cb-45b1-a9f5-dddfc1c4025c,eeaec894-d856-4106-9fa1-662b1dc6c6f1,979f02c6-3986-44d6-b5e8-308e89210c8d,31dd02fa-3522-438e-bef5-da14902f6c1b'
	end


	describe "Uniprot API" do
		it "/td/api/v1/uniprot/test[?param_test=<something>] should return a simple json" do
			get "td/api/v1/uniprot/test.json"

			response.status.should == 200
			parsed_resp =	JSON.parse(response.body)
			response.body.should be_kind_of(String)
			parsed_resp.should be_kind_of(Hash)
		end


		it "/.../multiple.json?entries=<acc_1,acc_2 should return a json ready to use with ExtJs grid" do
			accs = @accs
			get "/td/api/v1/uniprot/multiple.json?entries=#{accs}"

			parsed_resp = JSON.parse(response.body)
			parsed_resp.should be_kind_of(Hash)
			parsed_resp['ops_records'].should be_kind_of(Array)
			parsed_resp['ops_records'].length.should > 0

		end


		it "should produce xml for multiple targets" do
			accs = @accs
			get "/td/api/v1/uniprot/multiple.xml?entries=#{accs}"

			response.status.should == 200
puts "#{response.body}\n"
			xmlDoc = Nokogiri::XML(response.body)
			xmlDoc.should_not be_nil

		end


		it "/td/api/v1/uniprot/byname.json?name=<a name>&uuid=<uuid> should return a json with info about target" do
			get "/td/api/v1/uniprot/byname.json?name=Breast%20cancer%20type%202%20susceptibility%20protein"

			response.status.should == 200
			parsed_resp = JSON.parse(response.body)
			parsed_resp.should be_kind_of(Hash)

		end


		it "/td/api/v1/uniprot/<accession> should be return a json with uniprot info about accesssion" do
			get "/td/api/v1/uniprot/Q13362.json"

			response.status.should == 200
			parsed_resp = JSON.parse(response.body)
			parsed_resp.should be_kind_of(Hash)
			parsed_resp.keys.length.should > 0

			xmlDoc = Nokogiri::XML(response.body)
			xmlDoc.should_not  be_nil
			xmlDoc.errors.length.should > 0
		end


		it "should yield XML output as well for all previous requests" do
			get "/td/api/v1/uniprot/Q13362.xml"
			response.status.should == 200
			xmlDoc = Nokogiri::XML(response.body)
			xmlDoc.should_not be_nil

			get "/td/api/v1/uniprot/byname.xml?name=Breast%20cancer%20type%202%20susceptibility%20protein"
			response.status.should == 200
			xmlDoc.should_not be_nil

		end
	end


	describe "OPS APi" do

		it "lookup should get a list of entries from a term" do

		end
	end

end