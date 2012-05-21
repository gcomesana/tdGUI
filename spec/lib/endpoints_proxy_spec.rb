# require "rspec"
# require 'spec_helper'
require File.expand_path(File.dirname(__FILE__) + '/../spec_helper')

describe "Behaviour of EndpointsProxy" do
#	include TdguiProxy
	it "should be ok" do
		#To change this template use File | Settings | File Templates.
		true.should == true
	end


	it "should exist the module" do
		EndpointsProxy.autocheck().should == true
		false.should == false
	end

=begin
	it "inner class should make a request" do
		myInnerProxy = EndpointsProxy::InnerProxy.new
		myInnerProxy.should_not be_nil

		myInnerProxy.checkConceptWiki.should == true
	end

	it "inner class should make a coreApi check" do
		myInnerProxy = EndpointsProxy::InnerProxy.new
		myInnerProxy.should_not be_nil

		myInnerProxy.checkCoreAPI.should == true
		myInnerProxy.coreEndpointsChecked.should > 0
	end
=end

	it "module check conceptWiki should ping back" do
		result = EndpointsProxy.autocheck.should be_true
		result = EndpointsProxy.checkConceptAPI.should be_true

	end


	it "module check coreApi should ping back" do
		result = EndpointsProxy.autocheck.should be_true
		EndpointsProxy.checkCoreAPI.should be_true

	end

end