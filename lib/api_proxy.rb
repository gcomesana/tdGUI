
require 'active_support'

# This is a class to perform the background necessary tasks to perform the
# API functions, mostly regarding to get data from remote sources other than
# Uniprot / OPS
class APIProxy

	GO_RESULTS_LIMIT = 50
	GO_PROCESS4TARGET = 'http://www.ebi.ac.uk/QuickGO/GAnnotation?protein=xxxx&format=tsv&col=proteinID,proteinSymbol,evidence,goID,goName,ref,with,from&aspect=P&limit='
	TARGETS_4_PROCESS = 'http://www.uniprot.org/uniprot/?query=%22xxxx%22+AND+%28organism%3A%22Human+%5B9606%5D%22+OR+organism%3A%22Rat+%5B10116%5D%22%29+AND+reviewed%3A%22yes%22+AND+go%3A%22biological+process+%5B0008150%5D%22&sort=score&format=tab&columns=id,protein%20names,entry%20name,genes,families,domains&limit='
	TARGETS_4_DISEASE = 'http://www.uniprot.org/uniprot/?query=annotation%3A%28type%3Adisease+xxxx%29+AND+reviewed%3Ayes+AND+%28organism%3A%22Human+%5B9606%5D%22+OR+organism%3A%22Rat+%5B10116%5D%22%29&sort=score&format=tab&columns=id,protein%20names,entry%20name,genes,families,domains'

	CHEMBL_TARGET = 'https://www.ebi.ac.uk/chemblws/targets/uniprot/xxxx'
	CHEMBL_TARGET_ACTIVITY = 'https://www.ebi.ac.uk/chemblws/targets/xxxx/bioactivities'
	CHEMBL_COMPOUND_ACTIVITY = 'https://www.ebi.ac.uk/chemblws/compounds/xxxx/bioactivities'

	CHEMBLID_TARGET_INFO = 'https://www.ebi.ac.uk/chemblws/targets/xxxx'
	MAX_CHEMBL_ACTIVITIES = 250

	SWISS_VAR_URL = 'http://swissvar.expasy.org/cgi-bin/swissvar/result?format=tab&global_textfield=xxxx'

	OMIM_APIKEY = '7630D3726122E8FDCFD9465523A059918CA1258B'
	OMIN_DISEASE_LOOKUP =
		'http://api.omim.org/api/entry/search?search=xxxx&start=0&limit=10&format=json&apiKey='
	# 'http://api.omim.org/api/entry/search?search=avian+flu&start=0&limit=20&format=json&apiKey='
	OMIM_ENTRY_INFO = 'http://api.europe.omim.org/api/entry?mimNumber=xxxx&include=geneMap&include=externalLinks&format=json&apiKey='

	OMIM_ENTRY_SEARCH = 'http://api.omim.org/api/entry/search?search=xxxx&filter=&fields=&retrieve=&start=0&limit=10&sort=&operator=&include=geneMap&format=xml&apiKey='
	OMIM_GENEMAP_SEARCH = 'http://api.omim.org/api/geneMap/search?search=xxxx&filter=&fields=&start=0&limit=&sort=&operator=&format=xml&apiKey='

	GO_EVIDENCE_MAP = {
		'EXP'=> 'Inferred from Experiment',
		'IDA'=> 'Inferred from Direct Assay',
		'IPI'=> 'Inferred from Physical Interaction',
		'IMP'=> 'Inferred from Mutant Phenotype',
		'IGI'=> 'Inferred from Genetic Interaction',
		'IEP'=> 'Inferred from Expression Pattern',
		'ISS'=> 'Inferred from Sequence or Structural Similarity',
		'ISO'=> 'Inferred from Sequence Orthology',
		'ISA'=> 'Inferred from Sequence Alignment',
		'ISM'=> 'Inferred from Sequence Model',
		'IGC'=> 'Inferred from Genomic Context',
		'IBA'=> 'Inferred from Biological aspect of Ancestor',
		'IBD'=> 'Inferred from Biological aspect of Descendant',
		'IKR'=> 'Inferred from Key Residues',
		'IRD'=> 'Inferred from Rapid Divergence',
		'RCA'=> 'inferred from Reviewed Computational Analysis',
		'TAS'=> 'Traceable Author Statement',
		'NAS'=> 'Non-traceable Author Statement',
		'IC'=> 'Inferred by Curator',
		'ND'=> 'No biological Data available',
		'IEA'=> 'Inferred from Electronic Annotation',
		'NR'=> 'No recorded'
	}



# BIOLOGICAL PROCESSES STUFF ################################################
# Retrieves information about the biological processes the target is involved in
# @param [String] target_acc the uniprot target accession
	def get_process4target (target_acc)
		url = GO_PROCESS4TARGET.gsub(/xxxx/, target_acc)
		url = url + GO_RESULTS_LIMIT.to_s

		response = LibUtil.request(url, {})
		if response.code.to_i != 200
			puts err_msg("method get_process4target; param: #{target_acc}")
			nil

		else
			json_hash = parse_go_tsv(target_acc, response.body)
			json_hash
		end

	end



# Retrieves the targets involved in biological processes including process_term
# @param [String] process_term a term used to screen the processes to search. If
# this param is nil or an empty string all processes will be searched and the most
# scored target will be returned (actually, it makes non sense)
# @return [Hash] a structure with the 50 more scored targets and properties related to the search
	def get_targets4process (process_term)
		process_term = process_term.gsub(/ /, '+')
		url = TARGETS_4_PROCESS.gsub(/xxxx/, process_term)
		url = url + GO_RESULTS_LIMIT.to_s

		response = LibUtil.request(url, {})
		if response.code.to_i != 200
			puts err_msg("method get_targets4process; param: #{process_term}")
			nil

		else
			json_hash = parse_uniprot_tab(process_term, response.body)
			json_hash
		end

	end
# EO BIOLOGICAL PROCESSES STUFF ################################################


# BIOACTIVITIES (PHARMA-COMPOUND ACTIVITIES, CHEMBL) ###########################

# Get CHEMBL information out of an uniprot accession
# @param [String] target_acc a uniprot accession
# @return [Hash] a hash object with data retrieved from chembl for the target accession
	def uniprot2chembl (target_acc)
		url = CHEMBL_TARGET.gsub(/xxxx/, target_acc)
		response = LibUtil.request(url, {})
		if response.code.to_i != 200
			puts err_msg("method uniprot2chembl; param: #{target_acc}")
			nil

		else
			chembl_entry_hash = Hash.from_xml(response.body)
			chembl_entry_hash
		end

	end



	# Gets information about a target based on a chemblid
	# @param [String] chembl_id_target chemblId for a target
	# @return [Hash] a hash structure with the Chembl info for the target
	def get_chemblid_target_info (chembl_id_target)
		url = CHEMBLID_TARGET_INFO.gsub(/xxxx/, chembl_id_target.upcase)+'.json'

		response = LibUtil.request(url, {})
		if response.code.to_i != 200
			puts err_msg("method get_chemblid_target_info; param: #{chembl_id_target}")
			nil

		else
		  chembl_target_hash = JSON.parse(response.body)
			chembl_target_hash
		end

	end




# Get the bioactivites for a target out of a uniprot accession.
# It first gets the chemblId by requesting that information from chembl. After
# that request the bioactivities
# @param [String] target_acc an uniprot accession
# @return [Hash] a hash structure with the list of bioactivities.
	def activities4target(target_acc)
		chembl_entry = uniprot2chembl(target_acc)
		if chembl_entry.nil?
			return nil
		end
		chembl_target_id = chembl_entry['target']['chemblId']

		url = CHEMBL_TARGET_ACTIVITY.gsub(/xxxx/, chembl_target_id)+".json"

		resp_hash = Rails.cache.fetch url do
			response = LibUtil.request(url, {}, false)
			if response.code.to_i != 200
				puts err_msg("method activities4target; param: #{chembl_target_id}")
				nil

			else
				# acts_hash = Hash.from_xml(response.body)
				acts_hash = JSON.parse(response.body)
				res_hash = Hash.new
				activities = Array.new
				activity_count = 0
				acts_hash['bioactivities'].each { |activity|
					my_act = {:ingredient_cmpd_chemblid => activity['ingredient_cmpd_chemblid']}
					my_act[:bioactivity_type] = activity['bioactivity_type']
					my_act[:assay_chemblid] = activity['assay_chemblid']
					my_act[:assay_type] = activity['assay_type']
					my_act[:assay_description] = activity['assay_description']

					activities << my_act
					if activity_count == MAX_CHEMBL_ACTIVITIES
						break;
					else
						activity_count = activity_count + 1
					end
				}

				res_hash[:accession] = target_acc
				res_hash[:chemblid] = chembl_target_id
				res_hash[:pref_name] = chembl_entry['target']['preferredName']
				res_hash[:description] = chembl_entry['target']['description']
				res_hash[:activities] = activities

				res_hash
			end
		end # EO cache issue management block

	end



	# Get the activities where a compuound is involved. Contains a target_chemblid
	# useful to see a target the assay revealed
	# @param [String] chembl_cmpd_id the id for the compound
	# @return [Array] an array with the activities the compound is involved in
	def get_compound_activities(chembl_cmpd_id)

		url = CHEMBL_COMPOUND_ACTIVITY.gsub(/xxxx/, chembl_cmpd_id)+".json"

		resp_hash = Rails.cache.fetch url do
			response = LibUtil.request(url, {}, false)
			if response.code.to_i != 200
				puts err_msg("method get_compund_activities; param: #{chembl_cmpd_id}")
				nil

			else
				# acts_hash = Hash.from_xml(response.body)
				acts_hash = JSON.parse(response.body)
				res_hash = Hash.new
				activities = Array.new
				activity_count = 0
				organisms = Hash.new
				chembl_target_ids = Hash.new
				acts_hash['bioactivities'].each { |activity|
					# first, check if the entry is an organism and is in the organisms array
					accessions = nil
					isOrganism = organisms[activity['target_chemblid']].nil? == false
					isTarget = chembl_target_ids[activity['target_chemblid']].nil? == false

					# if not in organisms array, request to see if it is an organism
					# add to organisms and set isOrganism true
					if isOrganism == false && isTarget == false
						# if chembl_target_ids.index(activity['target_chemblid']).nil?
						#	chembl_target_ids << activity['target_chemblid']
						json_obj = get_chemblid_target_info(activity['target_chemblid'])
						type = json_obj['target']['targetType']
						if type.downcase == 'organism'
							organism_hash = {:name => json_obj['target']['preferredName'],
															 :chembl_id => json_obj['target']['chemblId']}
							organisms[activity['target_chemblid']] = organism_hash
							isOrganism = true
						else
							isOrganism = false
							accessions = json_obj['target']['proteinAccession']
							chembl_target_ids[activity['target_chemblid']] = accessions
						end
					end

					if isTarget
						accessions = chembl_target_ids[activity['target_chemblid']]
					end

					if isOrganism == false
						my_act = {'target_chemblid' => activity['target_chemblid']}
						my_act['bioactivity_type'] = activity['bioactivity_type']
						my_act['assay_chemblid'] = activity['assay_chemblid']
						my_act['assay_type'] = activity['assay_type']
						my_act['assay_description'] = activity['assay_description']
						my_act['target_confidence'] = activity['target_confidence']
						my_act['target_accessions'] = accessions # comma-separated accessions

						activities << my_act
						if activity_count == MAX_CHEMBL_ACTIVITIES
							break;
						else
							activity_count = activity_count + 1
						end
					end
				} # EO bioactivities loop

				res_hash['chemblid'] = chembl_cmpd_id
	#			res_hash[:pref_name] = chembl_entry['target']['preferredName']
	#			res_hash[:description] = chembl_entry['target']['description']
				res_hash['activities'] = activities

				res_hash
			end
		end # EO cache issue management block

	end


# EO BIOACTIVITIES (PHARMA-COMPOUND ACTIVITIES, CHEMBL) ########################





# OMIM RELATED STUFF #########################################################
	def get_targets4disease(disease, offset, limit)
		disease = disease.gsub(/ /, '+')
		url = TARGETS_4_DISEASE.gsub(/xxxx/, disease)
		if offset.nil? == false
			url = url + "&offset=#{offset}"
		end
		if limit.nil? == false
			url = url + "&limit=#{limit}"
		end

		response = LibUtil.request(url, {})
		if response.code.to_i != 200
			puts err_msg("method get_targets4disease; param: #{disease}")
			nil

		else
			json_hash = parse_uniprot_tab(disease, response.body)
			json_hash
		end

	end



	# Makes an OMIM geneSearch (geneMap/search?...) request and yields a ruby Hash with the form
	# {omim => {query_term => disease,
	#		genes => [{gene_id => [id1, id2,...], gene_name => name, chromosome => {},
	#							phenotypes => [{name => pheno_name, mim_number => xxx}, {}] },
	#							{gene_id => [id1, id2,...], gene_name => name, chromosome => {}
	#							phenotypes => [{name => pheno_name, mim_number => xxx}, {}] },
	#							{},
	#							]
	#					}
	# }
	def get_omim4disease (disease, start, limit)
		disease = disease.gsub(/ /, '+')
		url = OMIM_GENEMAP_SEARCH.gsub(/xxxx/, disease)
		url = url.gsub(/&limit=/, "&limit=#{limit}")
		url = url + OMIM_APIKEY

		response = LibUtil.request(url, {})
		if response.code.to_i != 200
			puts err_msg("method get_omim4disease; param: #{disease}")
			nil

		else
			resp_hash = Hash.new
			resp_hash[:query_term] = disease
			omim_hash = Hash.from_xml(response.body)

# strange xml translation: yields a entry array instead a geneMaplist array of geneMaps...
# to be clear, the array is geneMap, I think it should be geneMapList
			entries = omim_hash['omim']['searchResponse']['geneMapList']['geneMap']
			entry_list = Array.new
			entries.each { |entry|
				ids = entry['geneSymbols'].split(',')
				ids = ids.map {|id| id.strip }
				name = entry['geneName']
				chromo = {} # not filling by 03.2013, but ready for future filling
				phenotypes = Array.new
				phenotype_map = entry['phenotypeMapList']['phenotypeMap'] # it can be a hash or an array!!!
				if phenotype_map.is_a?(Hash)
					phenotype = {:name => phenotype_map['phenotype'],
											 :mim_number => phenotype_map['mimNumber']}
					phenotypes << phenotype

				else # otherwise, it is an Array
					phenotype_map.each { |pheno|
						pheno_name = pheno['phenotype']
						mim_number = pheno['mimNumber']

						phenotype = {:name => pheno_name, :mim_number => mim_number}
						phenotypes << phenotype
					}
				end

				this_entry = {:gene_id => ids, :gene_name => name, :chromosome => chromo,
											:phenotypes => phenotypes}
				entry_list << this_entry
			}

			{:omim => {:query_term => CGI::unescape(disease), :phenotype_list => entry_list}}
		end
	end # EO get_omim4disease method



	# Search diseases based on a term in OMIM
	def omim_disease_lookup (disease, start, limit)

		disease = disease.gsub(/ /, '+')
		url = OMIN_DISEASE_LOOKUP.gsub(/xxxx/, disease)
		url = url.gsub(/&start=0/, "&start=#{start}")
		url = url.gsub(/&limit=10/, "&limit=#{limit}")
		url = url + OMIM_APIKEY

		# url = 'http://api.omim.org/api/entry/search?search=avian+flu&start=0&limit=20&format=json&apiKey=7630D3726122E8FDCFD9465523A059918CA1258B'
		response = LibUtil.request(url, {})
		if response.code.to_i != 200
			puts err_msg("method get_omim4disease; param: #{disease}")
			nil

		else
			resp_array = Array.new
			resp_hash = Hash.new
			resp_hash[:query_term] = disease
			# omim_hash = Hash.from_xml(response.body)
			omim_hash = JSON.parse(response.body)
			entries = omim_hash['omim']['searchResponse']['entryList']

			entries.each { |item|
				item_hash = Hash.new
				item_hash['pref_label'] = item['entry']['titles']['preferredTitle']
				item_hash['match'] = item['entry']['matches']
				item_hash['uuid'] = item['entry']['mimNumber']
				item_hash['pref_url'] = 'http://www.omim.org/entry/'+item['entry']['mimNumber']

				resp_array << item_hash
			}

			resp_array
		end
	end # EO omim_disease_lookup



	# Gets the genes related to the traits of a disease from OMIM. The mimNumber is
	# that got from a disease lookup
	# @param [String] disease_mim_number a 6 digit OMIM number
	# @return [Hash] a hash object with a label and an array of gene information objects
	def omim_entry_info (disease_mim_number)
		url = OMIM_ENTRY_INFO.gsub(/xxxx/, disease_mim_number)
		url = url + OMIM_APIKEY

		resp = Rails.cache.fetch url do
			response = LibUtil.request(url, {}, false)
			if response.code.to_i != 200
				puts err_msg("method get_omim4disease; param: #{disease}")
				nil

			else
				resp_hash = Hash.new
				json_resp = JSON.parse(response.body)
				entry_hash = json_resp['omim']['entryList'][0]['entry']

				resp_hash['label'] = entry_hash['titles']['preferredTitle']
				# genes
				resp_hash['genes'] = Array.new
				if entry_hash['phenotypeMapList'].nil? == false
					entry_hash['phenotypeMapList'].each { |phenoMap|
						gene_hash = {'mim_number' => phenoMap['phenotypeMap']['mimNumber'],
												 'gene_symbol' => phenoMap['phenotypeMap']['geneSymbols']} # comma separated gene symbols!!!!!

						resp_hash['genes'] << gene_hash
					}

				elsif entry_hash['geneMap'].nil? == false
					gene_hash = {'mim_number' => entry_hash['geneMap']['mimNumber'],
								'gene_symbol' => entry_hash['geneMap']['geneSymbols']}

					resp_hash['genes'] << gene_hash
				end

				# adding uniprot accessions entries
				if entry_hash['externalLinks'].nil? == false
					accs_list = entry_hash['externalLinks']['swissProtIDs']
					accs_list = accs_list.nil? ? []: accs_list
					resp_hash['accessions'] = accs_list
				end

				resp_hash
			end
		end
	end


	# Make a request to swissvar to get a tab result with, among other things,
	# diseases for the uniprot accession or gene symbol/name related
	# @param [String] an_id is the idenfier for the gene or protein. It should
	# be an uniprot accession (P03372) or equivalent gene name (ESR1)
	# @return [Array] with the results with the found diseases
	def swissvar_genes4disease (an_id)
		url = SWISS_VAR_URL.gsub(/xxxx/, an_id)

		response = LibUtil.request(url, {})
		if response.code.to_i != 200
			puts err_msg("method swissvar_genes4disease; param: #{disease}")
			nil

		else
			resp_hash = Hash.new
			lines = response.body.split(/\n/)
			lines.delete_at(0) # remove the header line
			resp_hash = {'query_term' => CGI::unescape(an_id)}
			if lines.length == 0
				resp_hash['diseases'] = []
				return resp_hash
			end

			resp_hash['accession'] = lines[0].split(/\t/)[0]
			resp_hash['entry_name'] = lines[0].split(/\t/)[1]
			diseases = Array.new
			lines.each { |line|
				parts = line.split(/\t/)
				if parts[2].nil? == false && parts[2] != '' && diseases.index(parts[2]).nil?
					diseases << parts[2]
				end
			}
			resp_hash['diseases'] = diseases

			resp_hash
		end
	end # EO swissvar....
# EO OMIM RELATED STUFF #######################################################




	private

	# Yields a ruby hash / array (ready to be converted into either xml or json) from
	# the tab output sent back by go
	# @param [String] acc the accession
	# @param [String] content the http response content or body
	# @return [Hash] a hash structure with the list of process as a member
	def parse_go_tsv (acc, content)
		lines = content.split(/\n/)

		the_gene = lines.length > 1? lines[1].split(/\t/)[1]: ''
		parsed_hash = {:target => acc, :gene => the_gene}
		processes = Array.new
		old_evidence = nil, old_goid = nil
		lines[1..lines.length].each { |line| # skip the first line which is the header
			props = line.split(/\t/)
			next if props[2] == old_evidence && props[3] == old_goid

			ev_desc = GO_EVIDENCE_MAP[props[2]]
			process = {:goid => props[3], :go_name => props[4],
								 :evidence => props[2], :evidence_desc => ev_desc}

			processes << process
			old_goid = props[3]
			old_evidence = props[2]
		}

		parsed_hash[:processes] = processes
		parsed_hash
	end



	def parse_uniprot_tab (process_term, content)
		lines = content.split(/\n/)
		lines.delete_at(0) # remove the header line

		parsed_hash = {:query_term => CGI::unescape(process_term)}
		targets = Array.new
		lines.each { |line|
			props = line.split(/\t/)
			genes = props[3].nil? ? []: props[3].split(' ')
			families = props[4].nil? ? []: props[4].split(',')
			domains = props[5].nil? ? []: props[5].split(';')
			target = {:acc => props[0], :name => props[1], :entry_name => props[2],
								:genes => genes, :families => families, :domains => domains}

			targets << target
		}

		parsed_hash[:targets] = targets
		parsed_hash
	end



	def err_msg (msg)
		"API service not working properly now: #{msg}"
	end


end