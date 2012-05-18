class HomeController < ApplicationController
=begin
  before_filter :setup
  private
  def setup
puts "HomeController.setup"
    @now = DateTime.current.to_s
  end
=end
  public
  def index
    now = DateTime.current.to_s
puts "HomeController... #{now}"

# uncomment to fully override the entire UI
#    render :json => {'key'=>'valllllll'}.to_json, :layout => false
  end


  def test
puts "HomeController.test... #{@now}"
    render :json => {'controllers'=>'Home', 'time'=>"#{@now}"}.to_json, :layout => false
  end

end
