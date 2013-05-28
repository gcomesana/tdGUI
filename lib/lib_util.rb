
require 'rexml/document'
require 'net/http'
require 'net/https'
require 'net/smtp'
require 'uri'

class LibUtil
	include REXML
	include EndpointsProxy

# Filter and translate to json an uniprotxml response from EBI upon request for
# multiple uniprot entries retrieval based on accessions
# @param [String] xmlRes the body of the request performed elsewhere
# @return [Hash] a hash object with the corresponding fields
	def self.uniprotxml2hash (xmlRes)
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
				fieldsArray.push({'name' => 'pdbimg', 'type' => 'auto'})
				fieldsArray.push ({'name' => 'proteinFullName', 'type' => 'auto'})
				fieldsArray.push({'name' => 'accessions', 'type' => 'auto'})
				#				fieldsArray.push ({'name' => 'name', 'type'=>'auto'})
				#				fieldsArray.push ({'name' => 'keywords', 'type'=>'auto'})
				fieldsArray.push ({'name' => 'genes', 'type' => 'auto'})
				#				fieldsArray.push ({'name' => 'primaryName', 'type'=>'auto'})
				#				fieldsArray.push ({'name' => 'synonim_name', 'type'=>'auto'})
				fieldsArray.push ({'name' => 'organismSciName', 'type' => 'auto'})
				#				fieldsArray.push ({'name' => 'organism_comm_name', 'type'=>'auto'})
				fieldsArray.push ({'name' => 'function', 'type' => 'auto'})
				#				fieldsArray.push ({'name' => 'numOfRefs', 'type'=>'auto'})
				#				fieldsArray.push ({'name' => 'sequence', 'type'=>'auto'})
				#				fieldsArray.push({'name' => 'pdbs', 'type'=>'auto'})
			end

			if columnsArray.empty?
				puts "Filling columns..."
				columnsArray.push(set_column('PDB', 'pdbimg', nil, nil, nil, 'renderPdb'))
				columnsArray.push (set_column('Target name', 'proteinFullName'))
				columnsArray.push(set_column('Accessions', 'accessions', {'type' => 'string'}, 'templatecolumn',
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

			entryHash = self.decode_uniprot_entry(ent)
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

	# EO uniprotxml2hash


# Builds a column definition ready to be integrated with some extjs 4 grid
# @param [String] text the content of the cell in the extjs grid
# @param [Integer] data_index necessary for extjs 4 grid
# @param [String] filter filter for the grid data
# @param [String] xtype the type of the extjs component
# @param [String] tpl the template to render for this column
# @param [String] renderer a render method to override the default one
# @return [Hash]
	def self.set_column (text, data_index, filter=nil, xtype=nil, tpl=nil, renderer=nil)
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



# Extracts properties or features out of a uniprot entry for get_uniprot_by_name
# @param [REXML::Element] ent an xml element out of a uniprot response xml file
# @return [Hash] an object with the features for the target
	def self.decode_uniprot_entry (ent)
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
			entryHash['pdbimg'] = '<img src="http://www.rcsb.org/pdb/images/'+pdb_ids[0].value+'_asr_r_80.jpg" ' + 'width="80" height="80" />'
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

		all_gene_names = ent.elements.collect("gene/name") { |gene|
			# gene.text
			{:type => gene.attribute('type').value, :name => gene.text}
		}
		entryHash['allgenes'] = all_gene_names

		#		keywords = ent.elements.collect('keyword') {|keyw| keyw.text }
		#		entryHash['keywords'] = keywords


		org_sci = ent.elements.collect("organism/name[@type='scientific']") { |orgName| orgName.text }
		entryHash['organismSciName'] = org_sci[0].nil? ? '' : org_sci[0]

		org_comm = ent.elements.collect("organism/name[@type='common']") { |orgName| orgName.text }
		#			entryHash['organism_comm_name'] = org_comm[0].nil? ? '': org_comm[0]

		func_comment = ent.elements.collect("comment[@type='function']/text") { |comment| comment.text }
		entryHash['function'] = func_comment[0].nil? ? '' : func_comment[0]

		num_of_refs = 0
		ent.elements.each("reference") { |ref| num_of_refs += 1 }
		#		entryHash['numOfRefs'] = num_of_refs

		seq = ent.elements['sequence'] #		seq.attributes (=> {attribute1=value1,... })
		#		entryHash['sequence'] = {'length' => seq.attributes['length'],
		#														 'mass' => seq.attributes['mass'],
		#														 'seq' => seq.text.gsub!(/\s/, '') }

		entryHash
	end



	# Returns an array of gene results from a tabbed response from Uniprot
	# @param [Array] lines the tab-separated lines returned from the request
	# @param [String] term the search term to highlight
	def self.decode_tab_uniprot4gene (lines, term)
		result = Array.new
		first = true
		lines.each { |line|
			if first
				first = false
				next
			end

			hash = Hash.new
			hash[:match] = ''
			hash[:pref_url] = ''
			hash[:pref_label] = ''
			hash[:uuid] = ''

			fields = line.split(/\t/)
			# This is a guard to avoid entries without gene symbols!!!
			next if fields[4].nil?

			hash[:match] = fields[1]
			hash[:match].gsub!(/(#{term})/i, '<b>\1</b>')
			# hash[:match].gsub!(/<\/em>/, '</b>')
			hash[:pref_url] = 'http://www.uniprot.org/uniprot/'+fields[0]
			# puts "f4: #{fields[4]} :: f1: #{fields[1]}"
			hash[:pref_label] = '(' + fields[4] + ') ' + fields[1]
			hash[:uuid] = fields[0] + '|' + fields[4]

			result << hash
		}

		result
	end



# This method does a get request to an uri
# @param [String] url the target url
# @param [Hash] options parameters and other options for the request
# @return [Net::HTTPResponse] the object response
	def self.request(url, options)
		my_url = URI.parse(URI.encode(url))

		begin
			my_url = URI.parse(url)
		rescue URI::InvalidURIError
			my_url = URI.parse(URI.encode(url))
		end

		start_time = Time.now
		proxy_host = 'ubio.cnio.es'
		proxy_port = 3128
		#		res = Net::HTTP.start(my_url.host, my_url.port, proxy_host, proxy_port) { |http|
		res = nil
		if url.index('https').nil?
			req = Net::HTTP::Get.new(my_url.request_uri)
			res = Net::HTTP.start(my_url.host, my_url.port) { |http|
				http.request(req)
			}
		else
			http = Net::HTTP.new(my_url.host, my_url.port)
			http.use_ssl = true
			http.verify_mode = OpenSSL::SSL::VERIFY_NONE

			request = Net::HTTP::Get.new(my_url.request_uri)
			res = http.request(request)
		end


		#http_session = proxy.new(my_url.host, my_url.port)
		#
		#res = nil
		#proxy.new(my_url.host, my_url.port).start { |http|
		#Net::HTTP::Proxy(proxy_host, proxy_port).start(my_url.host) { |http|
		#	req = Net::HTTP::Get.new(my_url.request_uri)
		#	res, data = http.request(req)
		#
		#	puts "shitting data: #{data}\n"
		#	puts "res.code: #{res.code}\n"
		#}
		#
		#
		#res = Net::HTTP.start(my_url.host, my_url.port) { |http|
		#	req = Net::HTTP::Get.new(my_url.request_uri)
		#	http.request(req)
		#}


		#end_time = Time.now
		#elapsed_time = (end_time - start_time) * 1000
		#puts "***=> Time elapsed for #{url}: #{elapsed_time} ms\n"
		#
		#puts "response code: #{res ? res.code: 'res not available here'}"

		res
	end

end