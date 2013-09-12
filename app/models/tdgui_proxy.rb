

require 'rexml/document'
require 'net/http'
require 'net/smtp'
require 'uri'


# It does requests to endpoints different than coreAPI endpoints
# This is a proxy to perform different things the coreAPI does not support, either
# they are not supported by coreAPI itself or the coreAPI endpoints are down and
# we need new information sources to pull the information which is interesting/necessary
# for the application
#
# It is set as a model in order to have got a straight controller to perform
# the actions
class TdguiProxy
	include ActiveModel::Validations
	include EndpointsProxy
	include REXML
	extend ActiveModel::Naming


	OLD_DBFETCH_URL = 'http://www.ebi.ac.uk/Tools/dbfetch/dbfetch/uniprotkb/xxxx/uniprotxml'
	UNIPROT_BY_NAME = 'http://www.uniprot.org/uniprot/?query="xxxx"+AND+reviewed:yes&limit=20&offset=0&sort=score&format=xml'
	UNIPROT_BY_NAME_HUMAN = 'http://www.uniprot.org/uniprot/?query=name:"xxxx"+AND+organism:"Human+[9606]"+AND+reviewed:yes&limit=20&offset=0&sort=score&format=xml'
	UNIPROT_BY_NAME_QRY_HUMAN = 'http://www.uniprot.org/uniprot/?query="xxxx"+AND+organism:"Human+[9606]"+AND+reviewed:yes&limit=20&offset=0&sort=score&format=xml'
	UNIPROT_QUERY_HUMAN = 'http://www.uniprot.org/uniprot/?query=xxxx+AND+organism:%22Human+[9606]%22+AND+reviewed:yes&limit=20&offset=0&sort=score&format=xml'

	UNIPROT_BY_GENE = 'http://www.uniprot.org/uniprot/?query=gene:xxxx+AND+organism:"Human+[9606]"+AND+reviewed:yes&sort=score&offset=0&limit=20&format=xml'

	DBFETCH_URL = 'http://www.ebi.ac.uk/Tools/dbfetch/dbfetch?db=uniprotkb&id=xxxx&format=xml'

	CHEMBL_TARGET_URL = 'https://www.ebi.ac.uk/chemblws/targets/uniprot/xxxx'
	CHEMBL_BIOACT_URL = 'https://www.ebi.ac.uk/chemblws/targets/xxxx/bioactivities'

# Proxy/Model constructor
	def initialize
		@parsed_results = nil
		@uniprot_name = nil
	end


	def test (test_param = nil)
		string_param = test_param.nil? ? 'nil': test_param
		{:resp => "TdguiProxy.test method. testParam is: #{string_param}"}
	end



# Gets a list of genes from a term search on Uniprot
# @param [String] term the search term
# @param [Number] limit the maximun number of results returned
	def gene_lookup (term, start=0, limit = 25)
		url = UNIPROT_BY_NAME.gsub(/xxxx/, term)
		url = url.gsub(/format=xml/, 'format=tab')


		url_human = UNIPROT_BY_NAME_HUMAN.gsub(/xxxx/, term)
		url_human = url_human.gsub(/format=xml/, 'format=tab')


		if limit.nil? == false
			url = url.gsub(/limit=20/, "limit=#{limit}")
			url_human = url_human.gsub(/limit=20/, "limit=#{limit}")
		end
		if start.nil? == false
			url = url.gsub(/offset=0/, "offset=#{start}")
			url_human = url_human.gsub(/offset=0/, "offset=#{start}")
		end

=begin
		if limit != 25
			url = url.gsub(/limit=25/, "limit=#{limit}")
			url_human = url_human.gsub(/limit=25/, "limit=#{limit}")
		end
=end
		url = "#{url}&columns=id,protein names,citation,comments,genes"
		url_human = "#{url_human}&columns=id,protein names,citation,comments,genes"
		puts "start: #{start}-limit:#{limit}; gene_lookup url: #{url}"
		options = {}

	#		url =  URI.encode(url)
	# puts "the url encoded: #{url}"
		results = LibUtil.request(url_human, options)
		if results.body == ''
			results = LibUtil.request(url, options)
		end

		if results.code.to_i != 200
			puts "Uniprot fetch service not working properly right now!"
			return nil

		else
			lines = results.body.split(/\n/)
			lookup_arr = LibUtil.decode_tab_uniprot4gene(lines, term)
			lookup_arr
		end

	end

# Builds up a graph (array of hashes) for the uniprot accession taking into account
# a maximun number of nodes in the graph and a minimum score the interactions have to accomplish.
# @param [String] target_id an uniprot accession
# @param [Float] conf_val a confidence value threshold
# @param [Integer] max_nodes the max number of nodes for the graph
# @return [Array] the graph as an array of hashes
	def get_target_interactions (target_id, conf_val = 0.4, max_nodes = 6)

		target_graph = nil
		if target_id.nil? || target_id.empty? then
			nil

		else
			cache_key = 'interactions:'+target_id+'-conf_val:'+conf_val.to_s+'-max_nodes:'+max_nodes.to_s
			puts "GET_INTERACTIONS_TARGET cacheKey=#{cache_key}"
			target_graph = Rails.cache.fetch cache_key do
				intact_proxy = IntactProxy.new
				res = intact_proxy.get_interaction_graph(target_id, conf_val, max_nodes)

				res
			end # EO block...
			LibUtil.save_to_dbcache(cache_key, target_graph)

#			intact_proxy = IntactProxy.new
#			target_graph = intact_proxy.get_interaction_graph(target_id, conf_val, max_nodes)

#			target_graph = intact_proxy.get_super_interaction_graph(target_id, max_nodes, conf_val)
		end
	puts "target_graph length: #{target_graph.size()}\n"
		target_graph
	end



# Returns information about the (possible) interactions between the two target parameters within the
# confidence value threshold

	def get_interactions_for (intrtr1, intrtr2, threshold = 0.3)
		interactions = nil
		if intrtr1.nil? || intrtr1.empty? || intrtr2.nil? || intrtr2.empty? then
			nil

		else
			intact_proxy = IntactProxy.new
			puts "TdguiProxy.get_interactions_for... threshold is #{threshold}\n"
			
			interactions = intact_proxy.get_interactions_for(intrtr1, intrtr2, threshold)
#			target_graph = intact_proxy.get_super_interaction_graph(target_id, max_nodes, conf_val)
			interactions
		end

	end


# Request for entries to ebi and returns a hash properly formatted to be able
# to be converted to json with a single method call .to_json
# @param [String] entries a comma separeted uniprot accessions
# @return [Hash] a hash with the proper format to be converted into json
	def get_multiple_entries (entries)

		if entries.nil? then
			return "{}"
		end

puts "get_multiple_entries: #{entries}"
#		q_string = entries[:uniprotIds].join(',')
		entries_pairs = entries.split(',')
		accessions = entries_pairs.map { |it|
			it.split(';')[0]
		}
		q_string = accessions.join(',')
		url = DBFETCH_URL.gsub(/xxxx/, q_string)

		options = {}
		substring = ''
		if options[:limit].nil? then
			options[:limit] = @limit
		end
		options[:q] = substring

#		url = URI.parse(req_url)
		time_ini = Time.now
		puts "** MultipleEntriesRetrieval at #{time_ini}"
		results = LibUtil.request(url, options)
		if results.body == "" then # no concept found
			puts "No concept found!"
			@parsed_results = {:concept_uuid => nil, :concept_label => nil, :tag_uuid => nil, :tag_label => nil}
			return @parsed_results

		elsif results.code.to_i != 200 then
			puts "DBFetch service is not working properly!"
			return nil

		else
			# from dbfetch service, what we get is xml
			time_med = Time.now - time_ini
			puts "** lag after requesting is #{time_med}"
			time_med = Time.now
			uniprotHash = LibUtil.uniprotxml2hash (results.body)

			time_end = Time.now - time_med
			puts "** lag after uniprotxml2hash is #{time_end}"

			uniprotHash
#			return true
		end

	end



# Builds up a hash with properties extracted out of a single uniprot xml file.
# This goes straight to get a single uniprot entry
# @param [String] accession the accession of the target
# @return [Hash] a hash object filled with uniprot properties
	def get_uniprot_by_acc (accession)
		url = "http://www.uniprot.org/uniprot/#{accession}.xml"
		options = {}

		results = LibUtil.request(url, options)
#		puts "get_uniprot_by_acc req -> #{results.body.to_s}\n"
		if results.code.to_i != 200
			puts "Uniprot fetch service not working properly right now!"
			nil

		else
			xmldoc = Document.new results.body
			entries = xmldoc.elements.collect('uniprot/entry') { |ent| ent }
			first_entry = entries[0]

			entry_hash = LibUtil.decode_uniprot_entry(first_entry)
			entry_hash
		end
	end




# Gets uniprot information about a target from a gene, either a primary name or a synonim
# Those genes can be retrieved either from CHEMBL or Uniprot
# @param [String] gene a gene id
# @return [Hash] a hash object filled with uniprot properties
	def get_uniprot_by_gene (gene)
		url = UNIPROT_BY_GENE.gsub(/xxxx/, gene)
		options = {}

		results = LibUtil.request(url, options)
		if results.code.to_i != 200
			puts "Uniprot fetch service not working properly right now!"
			nil

		else
			xmldoc = Document.new results.body
			entries = xmldoc.elements.collect('uniprot/entry') { |ent| ent }
			first_entry = entries[0]

			entry_hash = LibUtil.decode_uniprot_entry(first_entry)
			entry_hash
		end

	end



# Builds up a hash with properties extracted out of a uniprot xml file
# @param [String] name a name of a target (no accession, just a name)
# @param [String uuid the uuid for the target as returned by conceptWiki]
# @return [Hash] a hash object filled with uniprot properties
	def get_uniprot_by_name (name, uuid)
		@uniprot_name = name
		concept_hash = nil
		url = nil

		name = CGI::escape(name) == name ? name: CGI::escape(name)
		if uuid.nil? == false && uuid.empty? == false # we have uuid
			concept_hash = get_target_by_uuid(uuid)
			if concept_hash[:uniprot_url] != ''
				url = concept_hash[:uniprot_url]+'.xml'
				url_human = url
			else
				url = UNIPROT_BY_NAME.gsub(/xxxx/, name)
				url_human = UNIPROT_BY_NAME_HUMAN.gsub(/xxxx/, name)

			end

		else
			url = UNIPROT_BY_NAME.gsub(/xxxx/, name)
			url_human = UNIPROT_BY_NAME_HUMAN.gsub(/xxxx/, name)
		end

puts "the url: #{url}"
		options = {}

#		url =  URI.encode(url)
# puts "the url encoded: #{url}"
		results = LibUtil.request(url_human, options)
		if results.body == ''
			results = LibUtil.request(url, options)
			if results.code.to_i != 200 || results.body == ''
				url = UNIPROT_BY_NAME_QRY_HUMAN.gsub(/xxxx/, name)
				# puts "less strict url: #{url}"
				results = LibUtil.request(url, options) # this is a more relaxed search query
				if results.code.to_i != 200 || results.body == ''
					url = UNIPROT_QUERY_HUMAN.gsub(/xxxx/, name)
					puts "last url: #{url}"
					results = LibUtil.request(url, options)
				end
			end
		end

		if results.code.to_i != 200
			puts "Uniprot fetch service not working properly right now!"
			return nil

		else

			xmldoc = Document.new results.body
			entries = xmldoc.elements.collect('uniprot/entry') { |ent| ent }
			first_entry = entries[0]

			entry_hash = LibUtil.decode_uniprot_entry(first_entry)
			entry_hash
		end

	end



# it queries chembl in order to get the bioactivities for a target
# @oaram [String] acc the accession or chemblId
# @return the compounds and chemblId for the target
# which are involved in the bioactivities...
	def get_bioactivities_from_acc(acc)
		is_accession = (protein_id =~ /[A-Z][A-Z0-9]{5}/) == 0

		chemblId = ''
		if is_accession
			chemblId = get_chemblid_from_acc(acc)
		end

		url = CHEMBL_BIOACT_URL.gsub(/xxxx/, chemblId)
		results = LibUtil.request(url, [])
		if results.code.to_i != 200
			puts "CHEMBL fetch service not working properly right now!"
			nil

		else # here we get a json
			jsonObj = JSON.parse(results.body)
			bioactivities = jsonObj['bioactivities']

			result = bioactivities.collect {|act|
				{:compound => act['ingredient_cmpd_chemblid'], :target_chembl_id => chemblId}
			}
			result
		end
	end




	def get_chemblid_from_acc (acc)

		url = CHEMBL_TARGET_URL.gsub(/xxxx/, acc)
		options = {}

		results = LibUtil.request(url, [])
		if results.code.to_i != 200
			puts "CHEMBL fetch service not working properly right now!"
			nil

		else # here we get a json
			obj = JSON.parse(results.body)
			chemblId = obj['target']['chemblId']
			chemblId
		end

	end



# Uses the http://ops.conceptwiki.org/web-ws/concept/get?uuid endpoint to get
# basic information about a target based on the uuid returned by a previous
# search by tag.
# @param [String] uuid the uuid for the target
# @return [Hash] a hash object with uuid, pref_label and uniprot_url as keys (with
# realted values)
	def get_target_by_uuid (uuid)
		inner_proxy = InnerProxy.new
		url = inner_proxy.conceptwiki_ep_get + "?uuid=#{uuid}"

		response = LibUtil.request(url, [])
		if response.code.to_i != 200
			puts "ConceptWiki get service not working properly right now!"
			nil

		else
			json_hash = JSON.parse(response.body)
			result = Hash.new
			result[:uuid] = json_hash['uuid']

			labels = json_hash['labels']
			pref_label = labels.select { |lb| lb['type'] == 'PREFERRED' }
			result[:pref_label] = pref_label[0]['text']

			urls = json_hash['urls']
			uniprot_url = urls.select { |url| url['value'] =~ /uniprot/ } rescue []
			result[:uniprot_url] = uniprot_url[0]['value'] rescue ''

			result
		end
	end


# Send an email as feedback. Use the standard Net::SMTP ruby class to make the sending
# @param [String] from  the sender of the email
# @param [String] subject the subject of the email
# @param [String] msg the body
# @return [Boolean] true if everything was ok; false otherwise
	def send_feedback (from, subject, msg)
		opts = Hash.new
		opts[:server]      ||= 'webmail.cnio.es'
		opts[:from]        ||= from
#		opts[:from_alias]  ||= ''
		opts[:subject]     ||= subject
		opts[:body]        ||= msg

		email_to = 'gcomesana@cnio.es'
		email_from = 'gcomesana@cnio.es'
		msg_date = Time.now.strftime("%a, %d %b %Y %H:%M:%S +0800")
=begin
		body_message = <<END_OF_MESSAGE
			From: #{opts[:from]}
			To: <#{email_to}>
			Subject: #{opts[:subject]}
			Date: #{msg_date}

			#{opts[:body]}
		END_OF_MESSAGE
=end
		msgstr = <<-END_OF_MESSAGE
		From: Your Name <your@mail.address>
		To: Destination Address <someone@example.com>
		Subject: test message
		Date: Sat, 23 Jun 2001 16:26:43 +0900
		Message-Id: <unique.message.id.string@example.com>

		This is a test message.
		END_OF_MESSAGE

		begin
			Net::SMTP.start(opts[:server]) do |smtp|
				smtp.send_message msgstr, email_from, email_to
			end
			return true

		rescue Exception => ex
			return false
		end
	end


# It gets the number of results to be fetched when getting results for the concept
# uri defined by the uri param
# @param [String] uri the concept wiki uri
	def get_pharm_count (uri)
		inner_proxy = InnerProxy.new

		uri_unencoded = CGI::unescape(uri) == uri
		esc_uri = uri_unencoded ? CGI::escape(uri) : uri
		url = inner_proxy.ops_api_count_pharma + "?app_id=#{inner_proxy.get_app_id}"
		url = url + "&app_key=#{inner_proxy.get_app_key}&uri=#{esc_uri}&_format=json"
		response = LibUtil.request(url, [])
		if response.code.to_i != 200
			puts "ConceptWiki get service not working properly right now!"
			nil

		else
			json_hash = JSON.parse(response.body)
			json_hash
		end
	end


	def get_pharm_results_by_page (concept_uri, page, pageSize)
		inner_proxy = InnerProxy.new

		page = page.nil? ? 1: page
		pageSize = pageSize.nil? ? 10: pageSize
		uri_unencoded = CGI::unescape(concept_uri) == concept_uri
		esc_uri = uri_unencoded ? CGI::escape(concept_uri) : concept_uri
		url = inner_proxy.ops_api_pharma_page_results + "?_format=json&uri=#{esc_uri}"
		url = url + "&_page=#{page}&_pageSize=#{pageSize}"
		url = url + "&app_id=#{inner_proxy.get_app_id}&app_key=#{inner_proxy.get_app_key}"
		response = LibUtil.request(url, [])

		if response.code.to_i != 200
			puts "ConceptWiki get service not working properly right now!"
			nil

		else
			json_hash = JSON.parse(response.body)
			json_hash
		end

	end

end