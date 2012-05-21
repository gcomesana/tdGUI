
# TODO try to include a helper to be accessed from the controller
# TODO or, use a new module by including it in here


class ApplicationController < ActionController::Base
	include ApplicationHelper
  protect_from_forgery


	before_filter :setup_proxy

	def setup_proxy
		puts "AppController.setup: getting request..."
		puts "url: #{request.url}"
		puts "params: #{params.inspect}"
		puts "query params: #{request.query_parameters.inspect}"

		puts "@template???: #{@template.inspect}"

#		test # method from ApplicationHelper

	end


=begin
	def default_url_options(options)
#		{:locale => I18n.locale}
		puts 'default_url_options :-S'
	end
=end

end

