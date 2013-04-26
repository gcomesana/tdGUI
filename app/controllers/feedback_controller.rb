
class FeedbackController < ApplicationController

	def index
		respond_to do |format|
			user_from = params[:userEmail]
			msg_issue = params[:feedbackText]
			msg_subject = params[:subject]
			email = FeedbackMailer.send_feedback(user_from, msg_issue, msg_subject)
			email.deliver

			msg_ok = "Your feedback has been sent successfully and a response will be send back shortly"
			format.json { render :json => {:success => true, :message => msg_ok} }
		end
	end




	def feedback
		respond_to do |format|
			user_from = params[:userEmail]
			msg_issue = params[:feedbackText]
			msg_subject = params[:subject]
			email = FeedbackMailer.feedback_email(user_from, msg_issue, msg_subject)

			puts "about to deliver an email"
			email.deliver

			msg_ok = "Thank you for using Target Dossier webapp. Your feedback has been sent successfully and a response will be send back shortly"
			format.json { render :json => {:success => true, :message => msg_ok} }
		end
	end

end
