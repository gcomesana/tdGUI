require "rspec"
require 'spec_helper'

describe "Intact proxy retrieves target interations from Intact" do
	before (:all) do

		@proxy = IntactProxy.new
	end

=begin
	it "should retrieve a valid JSON for Q!3362" do
		myres = @proxy.get_interaction_graph

		myres.should_not be_nil
		myres.should be_kind_of Array
		myres.length.should be > 0

		myres.to_json.should be_kind_of String

	end


	it "should retreive a valid JSON for Q76MZ3" do
		myres = @proxy.get_interaction_graph ('Q76MZ3')

		myres.should_not be_nil
		myres.should be_kind_of Array
		myres.length.should be > 0
		myres[myres.length-1].should be_kind_of Hash # { experiments => [] }
		myres.to_json.should be_kind_of String
puts "for Q76MZ3:\n#{myres.to_json}\n"

	end
=end

	it "should return true" do

#		ok = @proxy.get_super_interaction_graph('P08913', 5, 0.3) # 0 thousand 0 hundred
#		ok = @proxy.get_super_interaction_graph('Q13362', 5, 0.4)
#		ok = @proxy.get_super_interaction_graph('O43312', 5, 0.3) # dis 0 edges...
		ok = @proxy.get_super_interaction_graph('Q76MZ3', 5, 0.3)

		ok.should be_kind_of Array
		ok.should_not be_nil
#		ok.length.should be > 1

puts "\nAll interactions normalized\n"
		ok.each { |intrcn| puts "#{intrcn[:nodeFrom]}->#{intrcn[:nodeTo]} => #{intrcn.to_s}\n\n"}

	end


end