require 'rexml/document'
require 'net/http'
require 'uri'


class TdguiProxy
	include ActiveModel::Validations
	include EndpointsProxy
	include REXML
	extend ActiveModel::Naming


	DBFETCH_URL = 'http://www.ebi.ac.uk/Tools/dbfetch/dbfetch/uniprotkb/xxxx/uniprotxml'

# Constructor
	def initialize
		@parsed_results = nil

	end


# getMultipleEntries method
# Request for entries to ebi and returns a hash properly formatted to be able
# to be converted to json with a single method call .to_json
# @param entries, an hash with the accessions
# @return a hash with the proper format to be converted into json
	def get_multiple_entries (entries)

		q_string = entries[:uniprotIds].join(',')
		url = DBFETCH_URL.gsub(/xxxx/, q_string)

		options = {}
		substring = ''
		if options[:limit].nil? then
			options[:limit] = @limit
		end
		options[:q] = substring

#		url = URI.parse(req_url)
		results = request(url, options)
		if results.body == "" then # no concept found
			puts "No concept found!"
			@parsed_results = {:concept_uuid => nil, :concept_label => nil, :tag_uuid => nil, :tag_label => nil}
			return @parsed_results

		elsif results.code.to_i != 200 then
			puts "DBFetch service is not working properly!"
			return nil

		else
			# from dbfetch service, what we get is xml
			uniprotxml2json (results.body)
			return true
		end

	end




	private
# xml2json
	def uniprotxml2json (xmlRes)
		xmlDoc = Document.new xmlRes
		entries = xmlDoc.elements.collect('uniprot/entry') { |ent| ent }
		entryHash = Hash.new
		entries.each { |ent|

		  accList = ent.elements.collect('accession') { |acc| acc.text }
			entryHash['accessions'] = accList
	 		name = ent.elements['name']
			entryHash['name'] = name.text
			keywords = ent.elements.collect('keyword') {|keyw| keyw.text }
			entryHash['keywords'] = keywords

			prot_full_name = ent.elements.collect('protein/recommendedName/fullName') { |name|
				name.text
			}
			entryHash['protein_full_name'] = prot_full_name[0]
		  gene_pri_name = ent.elements.collect ("gene/name[@type='primary']") { |gene| gene.text }
			entryHash['primary_name'] = gene_pri_name[0].nil? ? '': gene_pri_name[0]

	  	gene_syn_name = ent.elements.collect ("gene/name[@type='synonim']") { |gene| gene.text }
			entryHash['synonim_name'] = gene_syn_name[0].nil? ? '': gene_syn_name[0]

			org_sci = ent.elements.collect ("organism/name[@type='scientific']") { |orgName| orgName.text }
			entryHash['organism_sci_name'] = org_sci[0].nil? ? '': org_sci[0]

			org_comm = ent.elements.collect ("organism/name[@type='commong']") { |orgName| orgName.text }
			entryHash['organism_comm_name'] = org_comm[0].nil? ? '': org_comm[0]

			func_comment = ent.elements.collect ("comment[@type='function']/text") { |comment| comment.text }
			entryHash['function'] = func_comment.nil? ? '': func_comment

			num_of_refs = 0
			ent.elements.each ("reference") { |ref| num_of_refs += 1 }
			entryHash['num_of_refs'] = num_of_refs

			seq = ent.elements['sequence'] #		seq.attributes (=> {attribute1=value1,... })
			entryHash['sequence'] = {'length' => seq.attributes['length'], 'mass' => seq.attributes['mass'], 'seq' => seq.text }

	 		pdbs = ent.elements.collect ("dbReference[@type='PDB']") {|pdb| pdb.attributes['id'] } # pdbs[i].elements[j>1]
		  entryHash['pdbs'] = pdbs

# puts "\n\ntheHash: #{entryHash}"
			entryHash.to_json
# puts "\njson:\n#{the_json}"

		}

	end



	def request(url, options)
		my_url = URI.parse(url)

		req = Net::HTTP::Get.new(my_url.request_uri)
		res = Net::HTTP.start(my_url.host, my_url.port) { |http|
			http.request(req)
		}

puts "response code: #{res.code}"
		res
	end


end