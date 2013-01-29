class FeedbackMailer < ActionMailer::Base
  default :from => "openphacts-td-issues@cnio.es"
#					:subject => "Target Dossier webapp issue"


	def feedback_email (user_email, feedback_text, subject)
		@feedback_data = {:mailbody => feedback_text, :sender_email => user_email}

		mail(:to => 'gcomesana@cnio.es', :reply_to => user_email, :subject => subject) # returned value
	end
end
