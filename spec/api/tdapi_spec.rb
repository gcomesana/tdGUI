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


	# describe "Uniprot API" do
		it "/api/status.json should return the simplest json possible on request" do
			get "#{@api_prefix}/status.json?param_test=thisisaparamTest"

			response.status.should == 200
			parsed_resp = JSON.parse(response.body)
			response.body.should be_kind_of(String)
			parsed_resp.should be_kind_of(Hash)
			parsed_resp['resp'].should_not be_nil

		end


		it "/api/target/lookup.json should return a list of conceptWiki entries for targets" do
			term = 'mtor'
			get "#{@api_prefix}/target/lookup.json?term=#{term}"

			response.status.should == 200
			response.body.should_not be_empty
			parsed_resp = JSON.parse(response.body)
			parsed_resp.should_not be_nil
			parsed_resp.should be_kind_of(Array)
			parsed_resp.should have_at_least(1).items
			parsed_resp.each { |entry|
				entry.should be_kind_of(Hash)
				entry['match'].should_not be_nil
				entry['match'].downcase.should include(term.downcase)
				puts "* #{entry.to_s}"
			}
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
# puts "#{response.body}\n"
			xmlDoc = Nokogiri::XML(response.body)
			xmlDoc.should_not be_nil

		end



		it "#{@api_prefix}/gene/lookup.json?term=<term> should return a list of entries for combos with matching genes" do
			mock_term = 'breast'
			mock_term = 'polymerase'
			get "#{@api_prefix}/gene/lookup.json?term=#{mock_term}"

			response.status.should == 200
			response.body.should_not be == ''
			json = JSON.parse(response.body)

			json.should be_kind_of(Array)
			json.length.should be > 0

			json[0].should be_kind_of(Hash)
			json[0]['match'].downcase.should include(mock_term)

		end


		it "#{@api_prefix}/target/byname/<a name>.json should return a json with info about target" do
			get "#{@api_prefix}/target/byname/Breast%20cancer%20type%202%20susceptibility%20protein.json"

			response.status.should == 200
			parsed_resp = JSON.parse(response.body)
			parsed_resp.should be_kind_of(Hash)

		end

=begin
		it "#{@api_prefix}/target/bygene/<genename> should return a valid json" do
			mock_gene = 'runx1'
			get "#{@api_prefix}/target/bygene/#{mock_gene}.json"

			response.status.should == 200
			parsed_resp = JSON.parse(response.body)
			parsed_resp.should be_kind_of(Hash)
		end
=end

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
	# end


	# describe "OPS API" do

		it "lookup should get a list of entries from a term" do
			lookup_concept = 'protein'
			lookup_term = 'breast'
			get "#{@api_prefix}/ops/lookup/#{lookup_concept}/#{lookup_term}.json"

			response.status.should == 200
			parsed_resp = JSON.parse(response.body)
			parsed_resp.should_not be_nil
			parsed_resp.should be_kind_of(Array)
			parsed_resp.length.should be > 0
			parsed_resp[0].should be_kind_of(Hash)
			(parsed_resp[0]['uuid'] == parsed_resp[1]['uuid']).should be_false
		end


		it "gets a protein info for a target from an uuid should be nil" do
			test_uuid = '09391f66-0728-4047-9116-2c7ebfaebde6'
			get "#{@api_prefix}/ops/protein/#{test_uuid}.json"

			response.status.should == 200
			response.body.should == 'null' # nothing found for this uuid
			# nothing else to test
		end


		it "gets protein information for a target from an uuid" do
			mock_uri = "http://www.conceptwiki.org/concept/bf5c71f6-211b-4ba4-b37d-f6dd1623b036"
			mock_uuid = "bf5c71f6-211b-4ba4-b37d-f6dd1623b036"

			get "#{@api_prefix}/ops/protein/#{mock_uuid}.json"
			response.status.should == 200
			parsed_resp = JSON.parse(response.body)
			parsed_resp.should_not be_nil
			parsed_resp.should be_kind_of(Hash)
			primary_topic = parsed_resp['result']['primaryTopic']
			primary_topic.should be_kind_of(Hash)
			primary_topic['prefLabel'].should_not be_nil
		end
=begin
		# not working, use /api/target/accession.json instead
		it "gets protein info from an accession" do
			test_acc = "P29274" # random accession
			get "#{@api_prefix}/ops/protein/#{test_acc}.json"

			response.status.should == 200
			response.body.should_not == 'null'
			parse_resp = JSON.parse(response.body)
			parse_resp.should be_kind_of(Hash)
			parse_resp['pref_label'].should_not be_nil
		end
=end
	# end

end