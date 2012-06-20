
require 'rspec'
require 'spec_helper'

describe TdguiProxyController do

	it "should be ok" do
		get :test

		resp = response.body
		resp.should_not be_nil
	end


	it "interactions retrieval should return a json" do
		get :interactions_retrieval, :target => 'Q13362'

		json_resp = JSON.parse(response.body)

		json_resp.should be_kind_of Array

		json_resp[0].should be_kind_of Hash

	end

end
