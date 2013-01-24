require "rspec"
require 'spec_helper'

describe "inner_proxy 'helper' class behaviour" do

	describe "check endpoints from inner_proxy" do
		before :all do
			@inner_proxy = InnerProxy.new
		end

		it "should check conceptWiki" do
			concept_wiki_check = @inner_proxy.check_conceptwiki

			concept_wiki_check.should_not be_nil
			concept_wiki_check.should satisfy { |concept_w|
				(concept_w.is_a? FalseClass) || (concept_w.is_a? TrueClass)
			}
puts "concept_wiki ok? #{concept_wiki_check}\n"

		end


		it "should conceptWiki endpoint not be nil" do
			@inner_proxy.core_endpoint_ready.should_not be_nil
			@inner_proxy.core_endpoint_ready.should include('conceptwiki')

		end

		it "should check coreAPI endpoints" do
			core_api_chk = @inner_proxy.checkCoreAPI()
			core_api_chk.should_not be_nil
			core_api_chk.should satisfy { |concept_w|
				(concept_w.is_a? FalseClass) || (concept_w.is_a? TrueClass)
			}

		end


		it "should get a valid json string from a uniprot tab list" do
			mock_proxy = double('InnerProxy')
#			mock_proxy.stub(:row2json).and_return('{"concept_uuid":"","concept_url":"","tag_uuid":"","tag_label":""'})
			mock_proxy.stub(:row2json).and_return('{"concept_uuid":"","concept_url":"","tag_uuid":"","tag_label":""},{"concept_uuid":"","concept_url":"","tag_uuid":"","tag_label":""}')

			new_inner_proxy = InnerProxy.new
			new_inner_proxy.uniprot2json("a line", "").should satisfy { |elem|
				expect { JSON.parse(elem) }.to_not raise_exception (JSON::ParserError)
				JSON.parse(elem).should be_kind_of Array
			}
		end


# Test the protein2Hash method; uses a uniprot xml file (chosen by chance) as input
		it "should get a hash object out of an uniprot xml file" do
			fileContent = ''
			File.open('public/resources/datatest/P78257.xml', 'r') do |f|
				while line = f.gets
					fileContent += line
				end
			end

			proteinHash = @inner_proxy.proteinInfo2hash(fileContent)
			proteinHash.should_not be_nil
			proteinHash.should be_kind_of Hash

			proteinHash.size.should be > 0
			proteinHash[:target_name].size.should_not be 0

		end

	end

end