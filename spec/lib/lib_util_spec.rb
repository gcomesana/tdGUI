require "rspec"
require 'spec_helper'

describe LibUtil do

	it "should should work on chembl request" do

		resp = LibUtil.request('https://www.ebi.ac.uk/chemblws/targets/uniprot/Q13362', {})
		resp.should_not be_nil
		resp.code.to_i.should_not be 200
		resp.code.to_i.should be 404 # not found...
		resp.body.should_not be('')
	end
end