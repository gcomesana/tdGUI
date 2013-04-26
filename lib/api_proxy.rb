
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

	OMIM_APIKEY = '7630D3726122E8FDCFD9465523A059918CA1258B'
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


	def activities4target(target_acc)
		chembl_entry = uniprot2chembl(target_acc)
		if chembl_entry.nil?
			return nil
		end
		chembl_target_id = chembl_entry['target']['chemblId']

		url = CHEMBL_TARGET_ACTIVITY.gsub(/xxxx/, chembl_target_id)
		response = LibUtil.request(url, {})
		if response.code.to_i != 200
			puts err_msg("method activities4target; param: #{chembl_target_id}")
			nil

		else
			acts_hash = Hash.from_xml(response.body)
			res_hash = Hash.new
			activities = Array.new
			acts_hash['list']['bioactivity'].each { |activity|
				my_act = {:ingredient_cmpd_chemblid => activity['ingredient_cmpd_chemblid']}
				my_act[:bioactivity_type] = activity['bioactivity_type']
				my_act[:assay_chemblid] = activity['assay_chemblid']
				my_act[:assay_type] = activity['assay_type']
				my_act[:assay_description] = activity['assay_description']

				activities << my_act
			}

			res_hash[:accession] = target_acc
			res_hash[:chemblid] = chembl_target_id
			res_hash[:pref_name] = chembl_entry['target']['preferredName']
			res_hash[:description] = chembl_entry['target']['description']

			res_hash
		end
	end



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
	def get_omim4disease (disease, limit)
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

			{:omim => {:query_term => disease, :phenotype_list => entry_list}}
		end

	end



	private

	# Yields a ruby hash / array (ready to be converted into either xml or json) from
	# the tab output sent back by go
	# @param [String] acc the accession
	# @param [Object] resp the http response object with code == 200
	def parse_go_tsv (acc, content)
		lines = content.split(/\n/)

		parsed_hash = {:target => acc, :gene => lines[0].split(/\t/)[1]}
		processes = Array.new
		lines.each { |line|
			props = line.split(/\t/)
			ev_desc = GO_EVIDENCE_MAP[props[2]]
			process = {:goid => props[3], :go_name => props[4], :evidence => props[2], :evidence_desc => ev_desc}

			processes << process
		}

		parsed_hash[:processes] = processes
		parsed_hash
	end



	def parse_uniprot_tab (process_term, content)
		lines = content.split(/\n/)
		lines.delete_at(0) # remove the header line

		parsed_hash = {:query_term => process_term}
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