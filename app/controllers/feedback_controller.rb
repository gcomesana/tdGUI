
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
		puts Dir.pwd
		respond_to do |format|
			user_from = params[:userEmail]
			msg_issue = params[:feedbackText]
			msg_subject = params[:subject]
			# email = FeedbackMailer.feedback_email(user_from, msg_issue, msg_subject)
			t = Time.now
			# puts "Opening file at #{t.strftime('%H:%M:%S.%L')}"
			filename = "feedback-#{t.strftime('%H%M%S%L')}.txt"

			msg_feedback = "User email: #{user_from}\n"
			msg_feedback = msg_feedback + "Subject: #{msg_subject}\n"
			msg_feedback = msg_feedback + "Issue:\n#{msg_issue}\n"
			f = File.open("public/feedback/#{filename}", 'w')
			f.puts(msg_feedback)
			f.close()

#			email.deliver
			msg_ok = "Thank you for using Target Dossier webapp. Your feedback has been sent successfully and a response will be send back shortly"
			format.json { render :json => {:success => true, :message => msg_ok} }
		end
	end

end
