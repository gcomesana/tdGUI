require "rspec"
require 'spec_helper'
require 'net/http'

describe "TdguiProxy model" do

	it "should get intractions as a hash for Q13362" do
		tdguiproxy = TdguiProxy.new
		target_acc = 'Q13362'

		target_int = tdguiproxy.get_target_interactions(target_acc, 0.4)

		target_int.should be_kind_of Array
		target_int.length.should be > 0

puts "Fucking end\n\n"
#	  target_int[:experiments].should_not be_nil
#		target_int[:adjacencies].length.should be > 0
	end


	it "should the interations retrieved have the right structure for JIT" do
		tdguiproxy = TdguiProxy.new
		target_acc = 'Q9BXW4'

		target_int = tdguiproxy.get_target_interactions(target_acc)
		target_int.should be_an_instance_of Array
		target_int.length.should be > 0


		last_elem = target_int.pop()
		last_elem.should be_kind_of Hash
#		last_elem.has_key?(:experiments).should be_true
puts "Fucking end\n\n"
	end


	it "should return the genes found for a target from uniprot accession" do
		tdguiproxy = TdguiProxy.new
		target_acc = 'P0ABH8'
#		target_acc = 'Q5H943'

		target_int = tdguiproxy.get_uniprot_by_acc(target_acc)
		target_int.should be_an_instance_of Hash
		target_int['allgenes'].should_not be nil

		target_int['allgenes'].should be_kind_of Array

	end


	it "should return the genes found for a target from uniprot accession" do
		tdguiproxy = TdguiProxy.new
		gene_name = 'CACNA1C'

		target_int = tdguiproxy.get_uniprot_by_gene(gene_name)
		target_int.should be_an_instance_of Hash
		target_int['allgenes'].should_not be nil

		target_int['allgenes'].should be_kind_of Array

	end


	it "should return a hash with 3 elements got from conceptWiki" do
		proxy = TdguiProxy.new
		target_uuid = 'd76e4a78-c06c-416e-a0fc-c073a69000d5'

		proxy.should_not be_nil
		hash_res = proxy.get_target_by_uuid(target_uuid)

		puts "hash_res 2 json: #{hash_res.to_json}\n"
		hash_res.should_not be_nil
		hash_res.should have(3).items
		hash_res[:uniprot_url].should match(/uniprot/)
		hash_res.should have_key(:uuid)
	end




	it "should return a hash from a target label" do
		proxy = TdguiProxy.new

		proxy.should_not be_nil
		target_uuid = 'd76e4a78-c06c-416e-a0fc-c073a69000d5'
		target_label = 'Breast cancer type 2 susceptibility protein'
		target_uuid = 'dac58899-7b85-4374-87b5-dd563236276b'
		target_label = 'Estrogen receptor 2'

#		target_label = 'Deleted in bladder cancer protein 1'
		target_uuid = nil
		target_hash = proxy.get_uniprot_by_name(target_label, target_uuid)

		target_hash.should_not be_nil
		target_hash.length.should be > 0

		target_hash['accessions'].should be_instance_of Array

		target_hash.each_key { |key| puts "#{key} -> #{target_hash[key]}" }
	end


	it "should return a hash from a target accession" do
		proxy = TdguiProxy.new

		proxy.should_not be_nil
		target_acc = 'Q5H943'
		target_label = 'Breast cancer type 2 susceptibility protein'

#		target_label = 'Deleted in bladder cancer protein 1'
		target_hash = proxy.get_uniprot_by_acc(target_acc)

		target_hash.should_not be_nil
		target_hash.length.should be > 0
		puts "\nget_uniprot_by_acc(#{target_acc})\n"
		target_hash.each_key { |key| puts "#{key} -> #{target_hash[key]}" }

		target_hash['accessions'].should be_instance_of Array
		target_hash.should_not be_nil
		target_hash['accessions'].should be_kind_of Array
		target_hash['pdbimg'].should_not be_empty
		target_hash.should have_key('proteinFullName')
		target_hash.should have(7).items

	end

	it "should return an array with info for entries" do

		accs = 'P08913,Q14596,Q5H943,P29274,P42345'
		uuids = '59aabd64-bee9-45b7-bbe0-9533f6a1f6bc,ec79efff-65cb-45b1-a9f5-dddfc1c4025c,'
		uuids += 'eeaec894-d856-4106-9fa1-662b1dc6c6f1%2C,979f02c6-3986-44d6-b5e8-308e89210c8d,'
		uuids += 'fc2cb21b-3dcd-42ab-8bfc-d6bfe8d7d35a'

		uuids_arr = uuids.split(',')
		target_ids = []
		target_str = ''
		index = 0
		accs.split(',').each { |acc|
			target_ids << acc+';'+uuids_arr[index]
			target_str += acc+';'+uuids_arr[index]+','
			index += 1
		}

		target_str = target_str[0..(target_str.length-2)]
		td_proxy = TdguiProxy.new
puts "target ids: #{target_str}\n\n"
		hash = td_proxy.get_multiple_entries(target_str)

		hash.should_not be_nil
		hash.size.should be > 0
		hash.size.should be == 5

	end


	it "get_pharm_count should return a valid json with number of total results" do
		uri = 'http%3A%2F%2Fwww.conceptwiki.org%2Fconcept%2F59aabd64-bee9-45b7-bbe0-9533f6a1f6bc'
		uri = 'http://www.conceptwiki.org/concept/59aabd64-bee9-45b7-bbe0-9533f6a1f6bc'

		uri = URI.encode(uri)
		td_proxy = TdguiProxy.new
		resp = td_proxy.get_pharm_count uri

		resp.should_not be_nil
		resp.should be_kind_of Hash
		resp['result'].should be_kind_of Hash
		resp['result']['primaryTopic']['targetPharmacologyTotalResults'].should be == 2304
	end


	it "get_pharm_resutls_by_page should return similar large json with 25 results" do
		uri = 'http%3A%2F%2Fwww.conceptwiki.org%2Fconcept%2F59aabd64-bee9-45b7-bbe0-9533f6a1f6bc'
		uri = 'http://www.conceptwiki.org/concept/59aabd64-bee9-45b7-bbe0-9533f6a1f6bc'

		page_size = 25
		page = 1

		td_proxy = TdguiProxy.new
		resp = td_proxy.get_pharm_results_by_page(uri, page, page_size)

		resp.should_not be_nil
		resp.should be_kind_of Hash
		resp['result'].should be_kind_of Hash
		resp['result']['items'].should be_kind_of Array
		resp['result']['items'].should have(25).items
	end


	it "get_pharm_results_by_page should return only 4 results" do
		uri = 'http%3A%2F%2Fwww.conceptwiki.org%2Fconcept%2F59aabd64-bee9-45b7-bbe0-9533f6a1f6bc'
		#		uri = 'http://www.conceptwiki.org/concept/59aabd64-bee9-45b7-bbe0-9533f6a1f6bc'

		page_size = 50
		page = 47

		td_proxy = TdguiProxy.new
		resp = td_proxy.get_pharm_results_by_page(uri, page, page_size)

		resp.should_not be_nil
		resp.should be_kind_of Hash
		resp['result'].should be_kind_of Hash
		resp['result']['items'].should be_kind_of Array
		resp['result']['items'].should have(4).items

	end


	it "gene_lookup should return an array of 25 fomatting objects after looking up uniprot" do
		mock_term = 'lung'
		mock_term = 'polymerase'

		td_proxy = TdguiProxy.new
		res = td_proxy.gene_lookup(mock_term)

		res.should be_kind_of(Array)
		res.length.should be == 25
		res[0].should be_kind_of(Hash)
		res[0][:match].downcase.should include(mock_term.downcase)
		res[1][:pref_url].should include('uniprot')
		(res[0][:uuid] == res[1][:uuid]).should be_false
		res[25].should be_nil
	end



	it "gene_lookup should return 35 resuls as limit was passed in as parameter" do
		mock_term = 'lung'
		mock_limit = 35

		td_proxy = TdguiProxy.new
		res = td_proxy.gene_lookup(mock_term, mock_limit)

		res.should be_kind_of(Array)
		res.length.should be == mock_limit
		res[0].should be_kind_of(Hash)
		res[0][:match].downcase.should include(mock_term.downcase)
		res[1][:pref_url].should include('uniprot')
		(res[2][:uuid] == res[3][:uuid]).should be_false
		res[mock_limit].should be_nil
	end

=begin
	it "should send an email" do
		email_proxy = TdguiProxy.new

		from = 'miumiu@crap.com'
		subject = 'everything is crap'
		msg = 'You heard ok, everything is a hyper-fucking shit'

		res = email_proxy.send_feedback(from, subject, msg)

		res.should be_true

	end
=end
end