
require 'rspec'
require 'spec_helper'

describe TdguiProxyController do

	it "should be ok" do
		get :test

		resp = response.body
		resp.should_not be_nil

		@target_label = 'TP53-regulated inhibitor of apoptosis 1'
	end


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

end
