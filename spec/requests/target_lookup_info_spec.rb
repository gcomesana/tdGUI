require "spec_helper"

describe "Target management" do

	it "simple test/status checks" do
		get "/tdgui_proxy/test"
		# expect(response).to render_template(:new)
		response.should_not be_nil

		get "/ops_api_calls/status"
		response.should_not be_nil
	end


	it "should perform the sequence for a target: lookup and info resorting uniprot" do
		brca1_mock_prefLabel_en = "Breast cancer type 1 susceptibility protein"
		brca1_mock_about = "http://www.conceptwiki.org/concept/5c6405bd-2b3d-4165-b521-8bb1d35b49c6"
		brca1_mock_uuid = "5c6405bd-2b3d-4165-b521-8bb1d35b49c6"

		get "/ops_api_calls/protein_info", :protein_uri => brca1_mock_about
		response.should_not be_nil
		parsed_resp = JSON.parse(response.body)
		parsed_resp.should_not be_nil

		parsed_resp.should be_kind_of(Hash)
		parsed_resp['success'].should_not be_nil
		parsed_resp['success'].should be_false

		get "/tdgui_proxy/get_uniprot_by_name", :label => brca1_mock_prefLabel_en, :uuid => brca1_mock_uuid
		response.should_not be_nil
		parsed_resp = JSON.parse(response.body)
		parsed_resp.should_not be_nil

		parsed_resp.should be_kind_of(Hash)
		parsed_resp['accessions'].length.should > 0
	end


	it "should perform the flow for a target w/o resorting to uniprot" do
		target_mock_about = "http://www.conceptwiki.org/concept/2e7b0121-6eff-4ebc-8375-e5e7122395c3"
		target_mock_uuid = "2e7b0121-6eff-4ebc-8375-e5e7122395c3"
		target_mock_prefLabel_en = "Voltage-gated sodium channel subunit alpha Nav1.2"

		get "/ops_api_calls/protein_info", :protein_uri => target_mock_about
		response.should_not be_nil

		parsed_resp = JSON.parse(response.body)
		parsed_resp.should_not be_nil
		parsed_resp['success'].should be_nil

		matches = parsed_resp['result']['primaryTopic']['exactMatch']
		matches.length.should > 0
		mymatch = matches.select { |item|
			if item['inDataset'].nil? == false
				item['inDataset'].index('uniprot').nil? == false
			end
		}

		mymatch.should_not be_nil
		mymatch.length.should be == 1
		mymatch[0].should be_kind_of(Hash)
	end

end