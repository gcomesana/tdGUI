require "spec_helper"

describe 'FeedbackMailer' do

	it "should (mock) send an email" do

		user_email = 'gominolo@goma.es'
		myMail = FeedbackMailer.send_feedback(user_email, 'This is only a feedback test', 'This is only a issue')
		somthign = myMail.deliver

		ActionMailer::Base.deliveries.empty?.should be_false # it was sent...
		myMail.from.should be == ['gcomesana@cnio.es']
		myMail.subject.should match(/issue/)
		myMail.reply_to.should be == [user_email]

	end

end
