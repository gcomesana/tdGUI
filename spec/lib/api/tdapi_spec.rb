

require 'spec_helper'
# require 'TargetDossierAPI'
require 'app/api/tdapi'

describe TDApi do

    it "returns an empty array of statuses" do
      get "/api/ops/lookup?type=protein&term=Q13362"
      response.status.should == 200
#      JSON.parse(response.body).should == []
		end


		it "should return a list of genes on a polymerase search" do
			mock_term = 'polymerase'
			get "/api/gene/lookup.json?term=#{mock_term}"

			response.status.should == 200
			json_obj = JSON.parse(response.body)
			json_obj.should_not be_nil

		end

=begin
  describe "GET /api/v1/statuses/:id" do
    it "returns a status by id" do
      status = Status.create!
      get "/api/v1/statuses/#{status.id}"
      response.body.should == status.to_json
    end
  end
=end
end