require "rspec"
require 'spec_helper'

describe "String-db requests" do
	it "should return a non empty hash for Q13362" do
		tdguiproxy = TdguiProxy.new
		target_acc = 'Q13362'

		target_int = tdguiproxy.get_target_interactions(target_acc)

		target_int.should be_kind_of Array
		target_int.length.should be > 0

#	  target_int[:experiments].should_not be_nil
#		target_int[:adjacencies].length.should be > 0

	end


	it "should have the right structure for JIT" do
		tdguiproxy = TdguiProxy.new
		target_acc = 'Q13363'

		target_int = tdguiproxy.get_target_interactions(target_acc)
		target_int.should be_an_instance_of Array
		target_int.length.should be > 0


		last_elem = target_int.pop()
		last_elem.should be_kind_of Hash
		last_elem.has_key?(:experiments).should be_true

	end

	it "should return a hash from a target label" do
		proxy = TdguiProxy.new

		proxy.should_not be_nil

		target_label = 'Deleted in bladder cancer protein 1'
		target_hash = proxy.get_uniprot_by_name(target_label)

		target_hash.should_not be_nil
		target_hash.length.should be > 0

		target_hash['accessions'].should be_instance_of Array

		target_hash.each_key { |key| puts "#{key} -> #{target_hash[key]}" }
	end



	it "should send an email" do
		email_proxy = TdguiProxy.new

		from = 'miumiu@crap.com'
		subject = 'everything is crap'
		msg = 'You heard ok, everything is a hyper-fucking shit'

		res = email_proxy.send_feedback(from, subject, msg)

		res.should be_true

	end
end