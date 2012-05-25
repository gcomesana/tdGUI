
require 'spec_helper'

describe ThrashcanController do


  before :each do
    # run before each test
  end

=begin
  it "should bounce back the ping" do
#    get :ping_json, :inParam=>'pongIn'

    response.should be_success

#    assert_response :success
#    assert_not_nil assigns (:pingIn)

  end
=end

    it "should be test" do
      get :test

      response.should be_success
    end


    it "should get ping" do
      myPing = 'myPing'

      get :ping, :query=>myPing
      response.should be_success

      myJson = JSON.parse (response.body)
      myJson['ping_back'].should_not be_nil
      myJson['ping_back'].should include(myPing)
    end

  after :each do
    # run after each test
  end
end
