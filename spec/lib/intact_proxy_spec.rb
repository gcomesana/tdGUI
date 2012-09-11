require "rspec"
require 'spec_helper'

describe "Intact proxy retrieves target interations from Intact" do
	before (:all) do

		@proxy = IntactProxy.new
	end

	it "should return true" do

#		ok = @proxy.get_super_interaction_graph('Q14596', 6, 0.5) # 0 thousand 0 hundred
#		ok = @proxy.get_super_interaction_graph('Q13362', 5, 0.4)
#		ok = @proxy.get_super_interaction_graph('O43312', 5, 0.3) # dis 0 edges...
#		ok = @proxy.get_super_interaction_graph('Q76MZ3', 5, 0.2)
		ok = @proxy.get_super_interaction_graph('P29274', 6, 0.5)


		ok.should be_kind_of Array
		ok.should_not be_nil
#		ok.length.should be > 1

puts "\nAll interactions normalized\n"
		ok.each { |intrcn| puts "#{intrcn[:nodeFrom]}->#{intrcn[:nodeTo]} => #{intrcn.to_s}\n\n"}

	end


end