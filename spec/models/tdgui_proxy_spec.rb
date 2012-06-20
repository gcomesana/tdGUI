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
end