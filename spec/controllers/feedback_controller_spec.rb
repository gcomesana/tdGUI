require 'spec_helper'

describe FeedbackController do

	it 'simply should send an email' do
		msg_text = "Application is not working"
		user_from = 'gominolo@moo.com'

		params = {:userEmail => user_from, :feedbackText => msg_text}
		post :feedback, params

		ActionMailer::Base.deliveries.empty?.should be_false
#		response.code.to_i.should be == 406

	end

end
