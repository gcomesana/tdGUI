class ThrashcanController < ApplicationController
=begin
  before_filter :setup

  private

  def setup
    @now = DateTime.current
  puts "ThrashcanController.setup... #{@now}"

    @ping = "Nothing to ping at #{@now}"
  end

=end
  public
  def start
  end

  def run
  end



  def test
  	now = DateTime.current.to_s
puts "ThrashcanCtrl.test... #{@now}"
puts "ThrashcanCtrl.test, @template: #{@template.inspect}"


    respond_to do |format|
      format.html {
        render :text => "<html><body><h1>pong at #{@now}</h1></body></html>",
        :layout => false
      }
      format.json {
        render :json => {'ping'=>"ponggggg at #{@now}"}.to_json,
        :layout => false
      }
    end

  end


  def ping
  	paramIn = params[:query]
  	@ping = "Ping back: #{paramIn} with #{TdGUI::Application.config.intactdb.to_s}"

    render :json => {'ping_back'=> @ping, 'time' => "#{@now}"}, :layout => false
  end


  def ping_json
  	paramIn = params[:inParam]? params[:inParam]: ''

  	if paramIn.length > 0
  		render :json => {'result'=>paramIn, 'time' => "#{@now}"}.to_json, :layout => false
  	else
  		render :json => {'result'=>'empty', 'time' => "#{@now}"}.to_json, :layout => false
    end
  end

end
