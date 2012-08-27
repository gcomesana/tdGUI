
require 'rspec'
require 'spec_helper'

describe TdguiProxyController do

	it "should be ok" do
		get :test

		resp = response.body
		resp.should_not be_nil

		@target_label = 'TP53-regulated inhibitor of apoptosis 1'
	end

=begin
	it "interactions retrieval should return a json" do
		get :interactions_retrieval, :target => 'Q76MZ3' # 'Q13362'
puts "interactions:\n#{response.body}\n"
		json_resp = JSON.parse(response.body)

		json_resp.should be_kind_of Array
		json_resp.length.should be > 0

		experiments = json_resp.pop()
		experiments.should be_kind_of Hash

		json_resp[0].should be_kind_of Hash

	end
=end

	it "should retrieve an uniprot result from a name" do
		thelabel = 'TP53-regulated inhibitor of apoptosis 1'
#		thelabel = 'Next to BRCA1 gene 1 protein (Homo sapiens)'
		get :get_uniprot_by_name, :label => thelabel

puts "result from name:\n#{response.body}\n"
		json_resp = JSON.parse(response.body)
		json_resp.should_not be_nil
		json_resp.length.should be > 0

		json_resp['accessions'].length.should be > 0
		json_resp['proteinFullName'].should_not be_empty
		json_resp['proteinFullName'].index(thelabel).should_not be_nil

	end


	it "should retrieve information for multiple targets, last one with no uniprot content" do
		accs = 'P08913,Q14596,Q5H943,P29274,-'
		uuids = 'd593db45-e954-4e97-94f7-c039350f97f4,ec79efff-65cb-45b1-a9f5-dddfc1c4025c,eeaec894-d856-4106-9fa1-662b1dc6c6f1,979f02c6-3986-44d6-b5e8-308e89210c8d,31dd02fa-3522-438e-bef5-da14902f6c1b'
		uuids_arr = uuids.split(',')
		target_ids = []
		index = 0
		accs.split(',').each { |acc|
			target_ids << acc+';'+uuids_arr[index]
			index += 1
		}
#		get :multiple_entries_retrieval, :entries => 'P08913,Q14596,Q5H943,P29274,-',
#				:uuids => 'd593db45-e954-4e97-94f7-c039350f97f4,ec79efff-65cb-45b1-a9f5-dddfc1c4025c,eeaec894-d856-4106-9fa1-662b1dc6c6f1,979f02c6-3986-44d6-b5e8-308e89210c8d,31dd02fa-3522-438e-bef5-da14902f6c1b'

		get :multiple_entries_retrieval, :entries => target_ids.join(',')
puts "\n#{response.body}\n"
		json_resp = JSON.parse(response.body)
		json_resp.should_not be_nil
		json_resp['ops_records'].should_not be_empty
		json_resp['metaData']['fields'][0]['name'].should be == 'pdbimg'

	end


	it "should retrieve information for multiple targets, first one with no uniprot content" do
			accs = 'P08913,Q14596,Q5H943,-,P29274'
			uuids = 'd593db45-e954-4e97-94f7-c039350f97f4,ec79efff-65cb-45b1-a9f5-dddfc1c4025c,eeaec894-d856-4106-9fa1-662b1dc6c6f1,31dd02fa-3522-438e-bef5-da14902f6c1b,979f02c6-3986-44d6-b5e8-308e89210c8d'
			uuids_arr = uuids.split(',')
			target_ids = []
			index = 0
			accs.split(',').each { |acc|
				target_ids << acc+';'+uuids_arr[index]
				index += 1
			}
	#		get :multiple_entries_retrieval, :entries => 'P08913,Q14596,Q5H943,P29274,-',
	#				:uuids => 'd593db45-e954-4e97-94f7-c039350f97f4,ec79efff-65cb-45b1-a9f5-dddfc1c4025c,eeaec894-d856-4106-9fa1-662b1dc6c6f1,979f02c6-3986-44d6-b5e8-308e89210c8d,31dd02fa-3522-438e-bef5-da14902f6c1b'

			get :multiple_entries_retrieval, :entries => target_ids.join(',')
	puts "\n#{response.body}\n"
			json_resp = JSON.parse(response.body)
			json_resp.should_not be_nil
			json_resp['ops_records'].should_not be_empty
			json_resp['metaData']['fields'][0]['name'].should be == 'pdbimg'
	end


	it "should send an email" do
		params = Hash.new
		params[:from] = 'manolo@eldelbombo.com'
		params[:subject] = 'The subject does not matter'
		params[:msg] = 'This is another place to place loren ipsum planet motherfocker'

		get :send_feedback, params

puts "EMAIL sent: #{response.body}\n"
		json_resp = JSON.parse(response.body)

		json_resp['success'].should_not be_nil
		json_resp['success'].should be_true
	end

end
