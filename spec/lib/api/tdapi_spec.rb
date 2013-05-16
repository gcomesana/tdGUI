

require 'spec_helper'

describe TargetDossierApi::TDApi do

	describe "GET /td/api/v1/ops/lookup" do
    it "returns an empty array of statuses" do
      get "/api/ops/lookup?type=protein&term=Q13362"
      response.status.should == 200
#      JSON.parse(response.body).should == []
    end
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