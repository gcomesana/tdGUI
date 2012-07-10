require "rspec"
require 'spec_helper'

describe "Intact proxy retrieves target interations from Intact" do
	before (:all) do

		@proxy = IntactProxy.new
	end


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

	end

end