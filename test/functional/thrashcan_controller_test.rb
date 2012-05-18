require 'test_helper'

class ThrashcanControllerTest < ActionController::TestCase
# TODO mocking, stub or so has to be included as fixtures don't work
=begin
  setup do
    @pingIn = foo(:fooOne)
    @pongIn = "merdi"
  end


=begin TODO test the route...
  test "should get run" do
    get :run
    assert_response :missing
  end
=end

  test "should get test" do
    get :test
    assert_response :success
  end

# test access to the right page
  test "should get ping" do
    get :ping
    assert_response :success
  end




  test "should get ping_json" do
    get :ping_json, :inParam=>"something"
    assert_response :success
  end


  test "should bounce back the ping" do
#    get :ping_json, :inParam=>@pingIn.pingIn
    result = get :ping_json, :inParam=>'pongIn'
#  puts "ping_json get result: #{result.inspect}"

    assert_response :success
#    assert_not_nil assigns (:pingIn)
  end
end
