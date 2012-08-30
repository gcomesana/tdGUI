

require 'rexml/document'
require 'net/http'
require 'net/smtp'
require 'uri'

#
# It does requests to endpoints different than coreAPI endpoints
#
class TdguiProxy
	include ActiveModel::Validations
	include EndpointsProxy
	include REXML
	extend ActiveModel::Naming


	DBFETCH_URL = 'http://www.ebi.ac.uk/Tools/dbfetch/dbfetch/uniprotkb/xxxx/uniprotxml'
	UNIPROT_BY_NAME = 'http://www.uniprot.org/uniprot/?query=xxxx+AND+organism:"Human+[9606]"+AND+reviewed:yes&sort=score&format=xml'

# Constructor
	def initialize
		@parsed_results = nil
		@uniprot_name = nil
	end




	def get_target_interactions(target_id, conf_val = 0.5, max_nodes = 6)

		if target_id.nil? || target_id.empty? then
			nil

		else
			intact_proxy = IntactProxy.new
#			target_graph = intact_proxy.get_interaction_graph(target_id)
			target_graph = intact_proxy.get_super_interaction_graph(target_id, max_nodes, conf_val)

		end
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




# get_uniprot_by_name
#
	def get_uniprot_by_name (name)
		@uniprot_name = name

		url = UNIPROT_BY_NAME.gsub(/xxxx/, name)
puts "the url: #{url}"
		options = {}

#		url =  URI.encode(url)
# puts "the url encoded: #{url}"

		results = request(url, options)
		if results.code.to_i != 200 then
			puts "Uniprot fetch service not working properly right now!"
			return nil

		else
			xmldoc = Document.new results.body
			entries = xmldoc.elements.collect('uniprot/entry') { |ent| ent }
			first_entry = entries[0]

			entry_hash = decode_uniprot_entry(first_entry)
			entry_hash
		end

	end



	def send_feedback (from, subject, msg)
		opts = Hash.new
		opts[:server]      ||= 'webmail.cnio.es'
		opts[:from]        ||= from
#		opts[:from_alias]  ||= ''
		opts[:subject]     ||= subject
		opts[:body]        ||= msg

		email_to = 'gcomesana@cnio.es'
		email_from = 'gcomesana@cnio.es'
		body_message = <<-EOF
			From: #{opts[:from]}
			To: <#{email_to}>
			Subject: #{opts[:subject]}

			#{opts[:body]}
		EOF

		begin
			Net::SMTP.start(opts[:server]) do |smtp|
				smtp.send_message body_message, email_from, email_to
			end
			return true

		rescue Exception => ex
			return false
		end
	end




	private
# uniprotxml2json
# Filter and translate to json an uniprotxml response from EBI upon request for
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
				fieldsArray.push({'name' => 'pdbimg', 'type'=>'auto'})
				fieldsArray.push ({'name' => 'proteinFullName', 'type'=>'auto'})
				fieldsArray.push({'name' => 'accessions', 'type'=>'auto'})
#				fieldsArray.push ({'name' => 'name', 'type'=>'auto'})
#				fieldsArray.push ({'name' => 'keywords', 'type'=>'auto'})
				fieldsArray.push ({'name' => 'genes', 'type'=>'auto'})
#				fieldsArray.push ({'name' => 'primaryName', 'type'=>'auto'})
#				fieldsArray.push ({'name' => 'synonim_name', 'type'=>'auto'})
				fieldsArray.push ({'name' => 'organismSciName', 'type'=>'auto'})
#				fieldsArray.push ({'name' => 'organism_comm_name', 'type'=>'auto'})
				fieldsArray.push ({'name' => 'function', 'type'=>'auto'})
#				fieldsArray.push ({'name' => 'numOfRefs', 'type'=>'auto'})
#				fieldsArray.push ({'name' => 'sequence', 'type'=>'auto'})
#				fieldsArray.push({'name' => 'pdbs', 'type'=>'auto'})
			end

			if columnsArray.empty?
puts "Filling columns..."
				columnsArray.push(set_column('PDB', 'pdbimg', nil, nil, nil, 'renderPdb'))
				columnsArray.push (set_column('Target name', 'proteinFullName'))
				columnsArray.push(set_column('Accessions', 'accessions', {'type' => 'string'},'templatecolumn',
																		 "<tpl for=\"accessions\">{.}<br/></tpl>"))
				columnsArray.push(set_column('Genes', 'genes', {'type' => 'string'}, 'templatecolumn',
																		 "<tpl for=\"genes\">{.}<br/></tpl>"))
#				columnsArray.push(set_column('Name', 'name'))
#				columnsArray.push (set_column('Keywords', 'keywords'))

#				columnsArray.push (set_column('Gen primary name','primaryName'))
#				columnsArray.push (set_column('Gene synonim name', 'synonim_name'))
				columnsArray.push (set_column('Organism', 'organismSciName'))
#				columnsArray.push (set_column('Common name', 'organism_comm_name'))
				columnsArray.push (set_column('Target function', 'function'))
#				columnsArray.push (set_column('Citations', 'numOfRefs', {'type' => 'int'}))
#				columnsArray.push (set_column('Sequence', 'sequence', {'type' => 'auto'},
#																			'templatecolumn',"Length: {sequence.length}. Mass: <b>{sequence.mass}</b><br/>{sequence.seq}"))

			end


#	 		pdbs = ent.elements.collect ("dbReference[@type='PDB']") {|pdb| pdb.attributes['id'] } # pdbs[i].elements[j>1]
#		  entryHash['pdbs'] = pdbs

			entryHash = decode_uniprot_entry (ent)
			recordsArray << entryHash
		} # EO entries loop

		topHash = Hash.new
		topHash['ops_records'] = recordsArray
		topHash['totalCount'] = entries.length
		topHash['success'] = true
		topHash['metaData'] = {'fields' => fieldsArray, 'root' => 'ops_records'}
		topHash['columns'] = columnsArray
# puts "\njson:\n#{topHash.to_json}"

		topHash
#		topHash.to_json

	end


# Builds a column definition ready to be integrated with some grid
	def set_column (text, data_index, filter=nil, xtype=nil, tpl=nil, renderer=nil)
		columnHash = {
			'text' => '', 'dataIndex' => '',
			'hidden' => false,
			'filter' => {'type' => 'string'},
			'width' => 110
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

		if renderer.nil? == false
			columnHash['renderer'] = renderer
		end
		columnHash
	end



	def decode_uniprot_entry (ent)
		entryHash = Hash.new

		if ent.nil?
			return entryHash
		end

		name = ent.elements['name']
#		entryHash['name'] = name.text

		pdb_ids = ent.elements.collect("dbReference[@type='PDB']") { |pdb|
			pdb.attribute('id')
		}
		if pdb_ids.length > 0
			entryHash['pdbimg'] = '<img src="http://www.rcsb.org/pdb/images/'+pdb_ids[0].value+'_asr_r_80.jpg" '									+ 'width="80" height="80" />'
		else
			entryHash['pdbimg'] = '<img src="/images/target_placeholder.png" width="80" height="80" />'
		end

		prot_full_name = ent.elements.collect('protein/recommendedName/fullName') { |name|
			name.text
		}
		entryHash['proteinFullName'] = prot_full_name[0]

		accList = ent.elements.collect('accession') { |acc| acc.text }
		accList.map! { |acc| '<a href="http://www.uniprot.org/uniprot/'+acc+'" target="_blank">'+acc+'</a>' }
		entryHash['accessions'] = accList

		gene_pri_name = ent.elements.collect("gene/name[@type='primary']") { |gene| gene.text }
#		entryHash['primaryName'] = gene_pri_name[0].nil? ? '': gene_pri_name[0]
		entryHash['genes'] = gene_pri_name

		gene_syn_names = ent.elements.collect("gene/name[@type='synonym']") { |gene| gene.text }
#		entryHash['synonim_name'] = gene_syn_name[0].nil? ? '': gene_syn_name[0]
		entryHash['genes'] << gene_syn_names
		entryHash['genes'].flatten!

#		keywords = ent.elements.collect('keyword') {|keyw| keyw.text }
#		entryHash['keywords'] = keywords


		org_sci = ent.elements.collect("organism/name[@type='scientific']") { |orgName| orgName.text }
		entryHash['organismSciName'] = org_sci[0].nil? ? '': org_sci[0]

		org_comm = ent.elements.collect("organism/name[@type='common']") { |orgName| orgName.text }
#			entryHash['organism_comm_name'] = org_comm[0].nil? ? '': org_comm[0]

		func_comment = ent.elements.collect("comment[@type='function']/text") { |comment| comment.text }
		entryHash['function'] = func_comment[0].nil? ? '': func_comment[0]

		num_of_refs = 0
		ent.elements.each("reference") { |ref| num_of_refs += 1 }
#		entryHash['numOfRefs'] = num_of_refs

		seq = ent.elements['sequence'] #		seq.attributes (=> {attribute1=value1,... })
#		entryHash['sequence'] = {'length' => seq.attributes['length'],
#														 'mass' => seq.attributes['mass'],
#														 'seq' => seq.text.gsub!(/\s/, '') }

		entryHash
	end


#
# This method does a get request to an uri
# @param url, the target url
# @param options, parameters and other options for the request
# @return the object response
	def request(url, options)
#		my_url = URI.parse(URI.encode(url))


		begin
			my_url = URI.parse(url)
		rescue URI::InvalidURIError
			my_url = URI.parse(URI.encode(url))
		end

		proxy_host = 'ubio.cnio.es'
		proxy_port = 3128

		proxy = Net::HTTP::Proxy(proxy_host, proxy_port)
		http_session = proxy.new(my_url.host, my_url.port)

		res = nil
#		proxy.new(my_url.host, my_url.port).start { |http|
		Net::HTTP::Proxy(proxy_host, proxy_port).start(my_url.host) { |http|
			req = Net::HTTP::Get.new(my_url.request_uri)
			res, data = http.request(req)

			puts "shitting data: #{data}\n"
			puts "res.code: #{res.code}\n"
		}


		res = Net::HTTP.start(my_url.host, my_url.port) { |http|
			req = Net::HTTP::Get.new(my_url.request_uri)
			http.request(req)
		}
puts "response code: #{res ? res.code: 'res not available here'}"
		res
	end


end