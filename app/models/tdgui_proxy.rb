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
# @param entries, a comma separeted uniprot accessions
# @return a hash with the proper format to be converted into json
	def get_multiple_entries (entries)

		if entries.nil? then
			return "{}"
		end

puts "get_multiple_entries: #{entries}"
#		q_string = entries[:uniprotIds].join(',')
		q_string = entries
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
#			return true
		end

	end

# TODO bring the json to the table (dynamicgrid3) and add more things upon query with christian


	private
# uniprotxml2json
# Filter and translate to json a uniprotxml response from EBI upon request for
# multiple uniprot entries retrieval based on accessions
# @param xmlRes, the body of the request performed elsewhere
# @return a json object with the corresponding fields
	def uniprotxml2json (xmlRes)
		xmlDoc = Document.new xmlRes
		entries = xmlDoc.elements.collect('uniprot/entry') { |ent| ent }
		fieldsArray = Array.new
		columnsArray = Array.new
		recordsArray = Array.new

		entries.each { |ent|
#			fieldsArray.clear
#			columnsArray.clear

			entryHash = Hash.new
			if fieldsArray.empty?
puts "Filling medatada..."
				fieldsArray.push({'name' => 'accessions', 'type'=>'auto'})
				fieldsArray.push ({'name' => 'name', 'type'=>'auto'})
				fieldsArray.push ({'name' => 'keywords', 'type'=>'auto'})
				fieldsArray.push ({'name' => 'proteinFullName', 'type'=>'auto'})
#				fieldsArray.push ({'name' => 'primaryName', 'type'=>'auto'})
#				fieldsArray.push ({'name' => 'synonim_name', 'type'=>'auto'})
#				fieldsArray.push ({'name' => 'organismSciName', 'type'=>'auto'})
#				fieldsArray.push ({'name' => 'organism_comm_name', 'type'=>'auto'})
#				fieldsArray.push ({'name' => 'function', 'type'=>'auto'})
				fieldsArray.push ({'name' => 'numOfRefs', 'type'=>'auto'})
				fieldsArray.push ({'name' => 'sequence', 'type'=>'auto'})
#				fieldsArray.push({'name' => 'pdbs', 'type'=>'auto'})
			end

			if columnsArray.empty?
puts "Filling columns..."
				columnsArray.push(set_column('Accessions', 'accessions', {'type' => 'string'},'templatecolumn',
																		 "<tpl for=\"accessions\">{.}<br/></tpl>"))
				columnsArray.push(set_column('Name', 'name'))
				columnsArray.push (set_column('Keywords', 'keywords'))
				columnsArray.push (set_column('Target name', 'proteinFullName'))
#				columnsArray.push (set_column('Gen primary name','primaryName'))
#				columnsArray.push (set_column('Gene synonim name', 'synonim_name'))
#				columnsArray.push (set_column('Scientific name', 'organismSciName'))
#				columnsArray.push (set_column('Common name', 'organism_comm_name'))
#				columnsArray.push (set_column('Target function', 'function'))
				columnsArray.push (set_column('Citations', 'numOfRefs', {'type' => 'int'}))
				columnsArray.push (set_column('Sequence', 'sequence', {'type' => 'auto'},
																			'templatecolumn',"Length: {sequence.length}. Mass: <b>{sequence.mass}</b><br/>{sequence.seq}"))
#				columnsArray.push(set_column('PDBs', 'pdbs'))
			end

			accList = ent.elements.collect('accession') { |acc| acc.text }
			entryHash['accessions'] = accList

			name = ent.elements['name']
			entryHash['name'] = name.text

			keywords = ent.elements.collect('keyword') {|keyw| keyw.text }
			entryHash['keywords'] = keywords

			prot_full_name = ent.elements.collect('protein/recommendedName/fullName') { |name|
				name.text
			}
			entryHash['proteinFullName'] = prot_full_name[0]

		  gene_pri_name = ent.elements.collect ("gene/name[@type='primary']") { |gene| gene.text }
#			entryHash['primaryName'] = gene_pri_name[0].nil? ? '': gene_pri_name[0]

			gene_syn_name = ent.elements.collect ("gene/name[@type='synonim']") { |gene| gene.text }
#			entryHash['synonim_name'] = gene_syn_name[0].nil? ? '': gene_syn_name[0]

			org_sci = ent.elements.collect ("organism/name[@type='scientific']") { |orgName| orgName.text }
#			entryHash['organismSciName'] = org_sci[0].nil? ? '': org_sci[0]

			org_comm = ent.elements.collect ("organism/name[@type='common']") { |orgName| orgName.text }
#			entryHash['organism_comm_name'] = org_comm[0].nil? ? '': org_comm[0]

			func_comment = ent.elements.collect ("comment[@type='function']/text") { |comment| comment.text }
#			entryHash['function'] = func_comment[0].nil? ? '': func_comment[0]

			num_of_refs = 0
			ent.elements.each ("reference") { |ref| num_of_refs += 1 }
			entryHash['numOfRefs'] = num_of_refs

			seq = ent.elements['sequence'] #		seq.attributes (=> {attribute1=value1,... })
			entryHash['sequence'] = {'length' => seq.attributes['length'],
															 'mass' => seq.attributes['mass'],
															 'seq' => seq.text.gsub!(/\s/, '') }

	 		pdbs = ent.elements.collect ("dbReference[@type='PDB']") {|pdb| pdb.attributes['id'] } # pdbs[i].elements[j>1]
#		  entryHash['pdbs'] = pdbs

			recordsArray << entryHash
		} # EO entries loop

		topHash = Hash.new
		topHash['ops_records'] = recordsArray
		topHash['totalCount'] = entries.length
		topHash['success'] = true
		topHash['metaData'] = {'fields' => fieldsArray, 'root' => 'ops_records'}
		topHash['columns'] = columnsArray
# puts "\njson:\n#{topHash.to_json}"

		topHash.to_json

	end


private
	def set_column (text, data_index, filter=nil, xtype=nil, tpl=nil)
		columnHash = {
			'text' => '', 'dataIndex' => '',
			'hidden' => false,
			'filter' => {'type' => 'string'},
			'width' => 150
		}

		columnHash['text'] = text
		columnHash['dataIndex'] = data_index
		columnHash['filter'] = filter unless filter.nil?
		unless xtype.nil?
			columnHash['xtype'] = xtype
			unless tpl.nil?
				columnHash['tpl'] = tpl
			end
		end

		columnHash
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