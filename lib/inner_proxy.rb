require 'net/http'
require 'rexml/document'
require 'nokogiri'
require 'uri'




# This proxy is a kind of helper class for the tdgui_proxy in order to
# give support to requests either to uniprot or coreAPI
class InnerProxy
	include REXML

	private
# Suppossed endpoints for coreApi
	CORE_API_URL_83 = "http://ops.few.vu.nl:8183/opsapi"
	CORE_API_URL_84 = "http://ops.few.vu.nl:8184/opsapi"
	CORE_API_URL_85 = "http://ops.few.vu.nl:8185/opsapi"
	CORE_API_URL_86 = "http://ops.few.vu.nl:8186/opsapi"
	CORE_API_URL_87 = "http://ops.few.vu.nl:8187/opsapi"

# URL for conceptwiki
	CONCEPT_WIKI_API_SEARCH_URL = "http://staging.conceptwiki.org/web-ws/concept/search/"

	TIMEOUT = 1.5 # arbitrary timeout to ping endpoints

	UNIPROT_PROTEIN_LOOKUP = 'http://www.uniprot.org/uniprot/?query=organism:9606+AND+xxxx&format=tab&columns=id,protein%20names,citation,comments,genes&sort=score&limit=25'
	UNIPROT_PROTEIN_LOOKUP_SHORT = 'http://www.uniprot.org/uniprot/?format=tab&columns=id,protein%20names,citation,comments,genes&sort=score&limit=25'
	UNIPROT_PROTEIN_INFO ='http://www.uniprot.org/'

	URL_FETCH_ENTRY = 'http://www.uniprot.org/uniprot/'


	public
	def initialize ()
#		@coreApiEndpoints =[CORE_API_URL_83]
		@coreApiEndpoints = [CORE_API_URL_83, CORE_API_URL_84, CORE_API_URL_85,
												 CORE_API_URL_86, CORE_API_URL_87]

		@coreApi_method = 'proteinInfo'
		@coreApi_uri = 'http://chem2bio2rdf.org/chembl/resource/chembl_targets/12261'
		@endpoint_ready = nil
		@coreEndpointsChecked = 0

		@requestErrMsg = ''

		@urlMap = {
			CONCEPT_WIKI_API_SEARCH_URL => UNIPROT_PROTEIN_LOOKUP_SHORT
		}

		@coreApiEndpoints.each { |endpoint|
			@urlMap[endpoint] = UNIPROT_PROTEIN_INFO
		}
	end

# Checks whether the endpoint for coreAPI is alive
# @return [Boolean] true if the endpoint is alive; false otherwise
	def core_endpoint_ready
		@endpoint_ready
#		UNIPROT_PROTEIN_LOOKUP_SHORT
	end

# Gets the number of coreAPI endpoints checked if a list of them is provided.
# The endpoints are hardcoded and they are volatile and prone to be changed by
# coreAPI developer team
# @return [Integer] the number of checked endpoints (not less than 0)
	def core_endpoints_checked
		@coreEndpointsChecked
	end


# Gets the concept wiki search URI
# @return [String] a conceptWiki url
	def conceptwiki_ep
		CONCEPT_WIKI_API_SEARCH_URL
	end



# Gets the uniprot url used to get entries based on a term (ej. brca2)
# @return [String] a uniprot endpoint
	def concept_uniprot_ep
		@urlMap[CONCEPT_WIKI_API_SEARCH_URL]
	end

# Returns one of the five supposed coreAPI endpoints.
# All of them are similar except for the port and prone to be down or to be changed
# by development team
# @return [String] the coreAPI endpoint
	def coreApiEP
		CORE_API_URL_83
	end


# Checks the conceptWiki endpoint, which is different of the coreApi endpoint
# @return [Boolean] true if the conceptWiki endpoint is reachable; false otherwise
	def checkConceptWiki ()
		# check to see if endpoint is responding
		#		api_method = 'proteinInfo'
		#		prot_uri = 'http://chem2bio2rdf.org/chembl/resource/chembl_targets/12261'
		prot_uri = CONCEPT_WIKI_API_SEARCH_URL
		options = Hash.new
		options[:limit] = 1
		options[:offset] = 0
		options[:q] = 'tp53' # default test

		url = URI.parse(prot_uri)
												 #		 url = checkEndpoints()
		result = nil
		Timeout::timeout (TIMEOUT) do
			result = request(url, options)
		end

# OJO
#		@endpoint_ready = @urlMap[CONCEPT_WIKI_API_SEARCH_URL]
#		return false
# EO OJO
		if result == nil || result < 0
			@endpoint_ready = @urlMap[CONCEPT_WIKI_API_SEARCH_URL]
			false
		else
			@endpoint_ready = CONCEPT_WIKI_API_SEARCH_URL
			true
		end
	end
# EO checkConcept...


# Check the core api by requesting the CORE_API_URLs to see if any of them ping back
# If so, the method returns true and the endpoint_ready member is set to the
# first endpoint in replying
# Otherwise, the method returns nil and en endpoint_ready is reset to nil
# @return [Boolean] true if any of the endpoints is alive; false otherwise
	def checkCoreAPI ()
		options = Hash.new
		options[:uri] = '<' + @coreApi_uri + '>'
		options[:limit] = 1
		options[:offset] = 0
		options[:method] = @coreApi_method

		alive = 0
		@endpoint_ready = nil
		@coreEndpointsChecked = 0
		@coreApiEndpoints.each do |endpoint|
			begin
			Timeout::timeout (TIMEOUT) do
				@coreEndpointsChecked += 1 # checkpoint will be checked no matter it is dead or alive
				alive = request(endpoint, options)
			end
			rescue Timeout::Error => e
				alive = 0
			end
# OJO
# 			@endpoint_ready = nil
#			return false
# EO OJO

			if alive > 0 then
puts "### checkCoreApi discover endpoint #{endpoint} for ''#{@coreApi_uri}'' & '#{@coreApi_method}'\n"
				@endpoint_ready = endpoint # any of them from 83 to 87
				break
			end
		end # EO loop on endopoints

#		if alive == 0
#			@endpoint_ready = @urlMap[CORE_API_URL_83]
#		end


		alive > 0 ? true : false
	end
# EO checkCoreApi




# Converst the tabular response from uniprot into a json similar to OPS json
# [{match:..., concept_uuid:...,concept_url:...,define_url:...,concept_label:..., concept_alt_labels:...,tag_uuid:...,tag_label:}, ..., {...}]
# @param [String] uniprot_res the tabular uniprot response
# @param [String] query the query which was input
# @return [String] a json string ready to use with default OPS combo-protein-lookup comp
	def uniprot2json (uniprot_res, query)

#		lines = uniprot_res.body.split("\n")
		lines = uniprot_res.split("\n")
		json_str = '[{"source":"uniprot"},'
		if lines.length > 0
#			json_str = '{"items":['
			cont_lines = 0
			for line in lines
				#  tabs = line.split("\t")

				if cont_lines > 0
					json_str += row2json(line, query)
				end
				cont_lines += 1
				# print "jsonStr: #{jsonStr.slice(0, jsonStr.length-1)}"
			end
			json_str = json_str.slice(0, json_str.length-1) # remove last comma
		end # EO if

		json_str += "]"
puts "inner_proxy.uniprot2json:\n#{json_str}\n"
		json_str
	end




# Returns a Hash from the uniprot info xml results. The pairs key=>value can
# be as what are showed below:
#
# @param [String] xmlRes a xml document string
# @return [Hash] a Hash object with the right information
	def proteinInfo2hash (xmlRes)

#		xmlDoc = Document.new xmlRes
#		entries = xmlDoc.elements.collect('uniprot/entry') { |ent| ent }
		xmlDoc = Nokogiri::XML(xmlRes)
		entries = xmlDoc.css('uniprot > entry')
# just take the very first entry
		main_entry =  entries.first

		recommended_name = main_entry.css('protein > recommendedName > fullName').collect {
			|node| node.text
		}
		synonyms = main_entry.css('protein > alternativeName > fullName').collect {
			|alt_name| alt_name.text
		}
		keywords = main_entry.css('keyword').collect { |keyw| keyw.text }

		organism = main_entry.css('organism > name').collect { |org|
			if org['type'] == 'scientific' then org.text end
		}
		function = main_entry.css("comment[type='function']").collect { |func|
			func.text
		}
		location = main_entry.css("comment[type='subcellular location'] > subcellularLocation > location").collect { |loc|
			loc.text
		}

		molWeight = nil
		seqLength = nil
		seq = nil
		main_entry.css("/sequence").collect { |theSeq|
			molWeight = theSeq.attributes['mass'].value
			seqLength = theSeq.attributes['length'].value
			seq = theSeq.text
		}

# the very first pdb reference is got. a comparison based on resolution can improve the choice
		pdbs = main_entry.css("dbReference[type='PDB']").collect { |pdb|
			pdb
		}
		pdbNodeMalformed = false
		pdbs.each { |node|
			resolution = node.css("property[type='resolution']")
			if resolution.nil? || resolution.length == 0 then
				pdbNodeMalformed = true
				break
			end
		}
		if pdbs.empty? == false && pdbNodeMalformed == false
# sort by value resolution to get the element with lowes resolution value
			pdbs = pdbs.sort_by{ |node|
				node.css("property[type='resolution']").first['value']
			}
		end



#		recommended_name = main_entry.elements.collect('//protein//recommendedName/fullName') {
#			|recName| recName.text
#		}
#		synonyms = main_entry.elements.collect('//protein//alternativeName/fullName') {
#			|alt_name| alt_name.text
#		}
#		keywords = main_entry.elements.collect('//keyword') { |keyw| keyw.text }
#
#		organism = main_entry.elements.collect('//organism/name') { |org|
#			if (org.attributes['type'] == 'synonym') then org.text end
#		}
#		function = main_entry.elements.collect("//comment[@type='function']") { |func|
#			func.text
#		}
#		location = main_entry.elements.collect("//comment[@type='subcellular location']") { |func|
#			func.text
#		}
#
#		molWeight = nil
#		seqLength = nil
#		seq = nil
#		main_entry.elements.collect("//sequence") { |theSeq|
#			molWeight = theSeq.attributes['mass']
#			seqLength = theSeq.attributes['length']
#			seq = theSeq.text
#		}
#
## the very first pdb reference is got. a comparison based on resolution can improve the choice
#		pdbs = main_entry.elements.collect("//dbReference[@type='PDB']") { |pdb|
#			pdb
#		}

		pdbResult = ''
		if pdbs.empty? == false
			pdbResult = 'http://www.pdb.org/pdb/explore/explore.do?structureId='
#			pdbResult += pdbs[0].css("property[type='resolution']").first['value']
			pdbResult += pdbs[0].attributes['id'].value
		end
		hash_result = Hash.new
		hash_result[:target_name] = "#{recommended_name[0]} (#{organism[0]})"
		hash_result[:target_type] = 'PROTEIN'
		hash_result[:description] = recommended_name[0]
		hash_result[:synonyms] = synonyms.join('; ')
		hash_result[:organism] = organism[0]
		hash_result[:keywords] = keywords.join('; ')
		hash_result[:cellularLocations] = location.join('; ')
		hash_result[:molecularWeight] = molWeight
		hash_result[:numberOfResidues] = seqLength
		hash_result[:sequence] = seq
		hash_result[:specificFunction] = function.join('; ')
		hash_result[:pdbIdPage] = pdbResult
		hash_result[:theoreticalPi] = nil

		hash_result
	end


	private
# request (addrs, opts)
# Make a simple http POST request and returns the response code
	def request (addrs, opts)

			uri = URI.parse (addrs)
			#myHttp = Net::HTTP.new(uri.host, uri.port)
			#request = Net::HTTP::Post.new(uri.request_uri)
			#request["Content-Type"] = "application/json"
			#
			#request.set_form_data(opts)
			#response = Net::HTTP::post_form(uri, opts)


		uri = URI.parse (addrs) rescue addrs
		response = Net::HTTP.post_form(uri == nil ? addrs : uri, opts)
		@requestErrMsg = "Request success"
		rescue Timeout::Error => exc
			@requestErrMsg = "ERROR: #{exc.message}"
			-1
		rescue Errno::ETIMEDOUT => exc
			@requestErrMsg = "ERROR: #{exc.message}"
			-2

		rescue Errno::ECONNREFUSED => exc
			@requestErrMsg = "ERROR: #{exc.message}"
			-3

		else
			#    puts "Response is..."
			#    puts response.code.to_i
			response.code.to_i
	end



# Returns a json object from a line. This is the result of a protein lookup
# request to Uniprot
# NOTE: concept_uuid will be represented here by the uniprot accession!!!
#
# @param [String] row a row from a tab request from Uniprot, with the fields
# uniprotId, protein names, pumed ids, comments, genes
# @param [String] query the input query
# @return [String] a json object as string, comma-ended
	def row2json (row, query)
		str_json = '{"concept_uuid":"","concept_url":"","tag_uuid":"","tag_label":"",'
		counter = 0
		tabs = row.strip.split("\t")
		match = false # to have only ONE match

		for elem in tabs

#			match = elem.include? query
			new_elem = elem
			new_elem = new_elem.gsub(/(#{query})/i, '<b>\1</b>')
			if match == false && new_elem != elem
				str_json += '"match":"' + new_elem + '",'
				match = true
			end

			if counter == 0 # this is the entry
				str_json += '"define_url":"'+URL_FETCH_ENTRY + elem.strip()+'",'
				str_json += '"concept_url":"'+URL_FETCH_ENTRY + elem.strip()+'",'
				str_json += '"concept_uuid":"'+elem.strip()+'",'

			elsif counter == 1 # set of protein names, only the first one is got
				prot_names = elem.split ("(")
				str_json += '"concept_label":"'+prot_names[0]+'",'

			elsif counter == 4 # gene names
				genes = elem.split(" ")
				gene_str = ''
				genes.each { |gene|
					gene_str += gene +"; "
				}
				gene_str = gene_str.slice(0, gene_str.length-1)

				str_json += '"concept_alt_labels":"'+gene_str+'",'
			end
			counter += 1

		end # EO for ... in
		str_json = str_json.slice(0, str_json.length-1)+'},'
	end


end # EO class InnerProxy