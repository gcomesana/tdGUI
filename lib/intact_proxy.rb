require 'net/http'
require 'uri'
require 'cgi'

require 'nokogiri'
require 'JSON'

class IntactProxy

	STRING_DB_URL = 'http://string-db.org/api/psi-mi/interactions?identifier=xxxx&required_score=900&limit=5&network_flavor=confidence'
	INTACT_URL = 'http://www.ebi.ac.uk/Tools/webservices/psicquic/intact/webservices/current/search/query/xxxx?format=xml25&species=9606'
	CONFIDENCE_VAL_THRESHOLD = 0.4
	MAX_EDGE_WIDTH = 10

	def initialize
# edges_counter counts the number of interactions between two nodes
# it is a hash where the key is an array with a pair of nodes,
# and the value the number of conncections between them
		@edges_counter = Hash.new
		@node_data = {"$color" => "blue", "$type" => "circle", "$dim" => 7}
	end


	def get_interaction_graph (target_id = 'Q13362', conf_threshold = 0.5)
#		xmlFile = File.new('../data/q13362-stringdb-interactions.xml') # psi-mi xml file

		myuri = INTACT_URL.gsub(/xxxx/, target_id)
		psimiResp = request(myuri, {})
		xmlDoc = Nokogiri::XML(psimiResp.body)

		experiments = Array.new
		expList = xmlDoc.css('experimentDescription')
		expList.each { |exp|
			experiment = def_experiment(exp)
			experiments << experiment
		}
#		puts "Retrieved experiments (#{experiments.length})\n"
#		experiments.each { |one| puts("#{one[:desc]}\n")}

		interactors = Array.new
		interactorList = xmlDoc.css('interactor')
		interactorList.each { |elem|
			interactor = def_interactor(elem)
			interactors << interactor

			#	interactionList = xmlDoc.css('interaction')
		}
# puts "***************************\nRetrieved interactors (#{interactors.length})\n"
		interactors.each { |intrctr| puts("#{intrctr.to_json}\n") }


		interactionList = xmlDoc.css('interaction')
		adjacencies = Array.new
		color = "white"
		interactionList.each { |intr|

			adjacency = def_interaction(intr, conf_threshold)
			adjacencies << adjacency
		}

		#puts "adjacencies is #{adjacencies.length} long\n"
		adjacencies.each { |edge|
			#	puts("#{edge.to_json}\n")
		}

		# $edges_counter.each { |k, v| puts "#{k} -> #{v}\n" }

		puts "\n buildup_graph\n"
		graph = buildup_graph(experiments, interactors, adjacencies)

		graph
	end



# Builds up a interaction graph starting off the target_id but getting additional
# first level deep interactions amid the closer neighbors
# @param target_id, the main target which the interactions wants to be yield of
# @return an array modelling all interactions
	def get_super_interaction_graph (target_id = 'P77569', conf_threshold = 0.5)
		myuri = INTACT_URL.gsub(/xxxx/, target_id)
		psimiResp = request(myuri, {})
#		intact_file = File.open ('public/resources/datatest/intact/Q13362.xml')
		xmlDoc = Nokogiri::XML(psimiResp.body)
#		xmlDoc = Nokogiri::XML(intact_file)

		main_interactors = build_interactors (xmlDoc)
=begin
puts "Starting from file...\n"
puts "MAIN interactors for #{target_id} net\n"
main_interactors.each { |intrctr| puts("#{intrctr.to_json}\n") }
puts "\n\n"
=end

		full_interactions = Array.new
		full_experiments = Array.new
		main_ids = main_interactors.collect { |item| item[:id][4..(item[:id].length-1)] }
		main_interactions = get_interactions_subset(main_interactors[0][:name], xmlDoc, main_interactors, conf_threshold)

# START loop over main interactors to build the 'supergraph'
		main_interactors.each { |interactor|
			accession = interactor[:name]
			my_intactUri = INTACT_URL.sub('xxxx', accession)
# puts "\nnew accession #{accession}\n"
			xmlstr = request(my_intactUri, [])
			inner_xml_doc = Nokogiri::XML(xmlstr.body)

# get the nodes subset for the current target
			new_subset = get_interactors_subset(inner_xml_doc, main_interactors)

# setup a new array with interactor objects extended with a real_id field
# real_id is the id from source main_interactors
			real_id_subset = Array.new
			new_subset.each { |node|
				node_index = main_interactors.index { |n_ref| n_ref[:name] == node[:name] }
				node_ref = main_interactors[node_index]

				node[:real_id] = node_ref[:id]
				real_id_subset << node
			} # EO loop over nodes subset to normalize


# get the interactions of interest for the current target
			interactions_subset = get_interactions_subset(accession, inner_xml_doc, new_subset, conf_threshold)

# Convert interactions ids for nodeFrom and nodeTo fields
# as well as edges_counter references
			interactions_subset.collect! { |intrcn|
# remove this interaction from the @edges_counter
				num_edges = @edges_counter.delete([intrcn[:nodeFrom],intrcn[:nodeTo]])

# calculates the index of the reference node in the real_id_subset
				noderef_index = real_id_subset.index { |node|
					actual_node_id = node[:id][4..(node[:id].length-1)]
					intrcn[:nodeFrom] == actual_node_id
				}
				noderef = real_id_subset[noderef_index]
				noderef_from = intrcn[:nodeFrom] = noderef[:real_id][4..(noderef[:real_id].length-1)]

				noderef_index = real_id_subset.index { |node|
					actual_node_id = node[:id][4..(node[:id].length-1)]
					intrcn[:nodeTo] == actual_node_id
				}
				noderef = real_id_subset[noderef_index]
				noderef_to = intrcn[:nodeTo] = noderef[:real_id][4..(noderef[:real_id].length-1)]

=begin
				if @edges_counter.has_key?([noderef_from, noderef_to])
					@edges_counter[[noderef_from, noderef_to]] += num_edges
				else
					@edges_counter[[noderef_from, noderef_to]] = num_edges
				end
=end
				if @edges_counter.has_key?([noderef_from, noderef_to]) == false
					@edges_counter[[noderef_from, noderef_to]] = num_edges
				end
				intrcn
			} # EO interactions_subset collect

# Remove from edges_counter those interactions who don't belong to the actual interaction net
			@edges_counter.delete_if { |edge_key|
				node_from = edge_key[0]
				node_to = edge_key[1]

				main_ids.index(node_from).nil? || main_ids.index(node_to).nil?
			}

# get the experiment ids for this interaction subnet in order to exclude
# experiments not involved on these interactions
			exp_ids = interactions_subset.collect { |intrcn|
#				intrcn[:interactionData][:experimentRef]
				intrcn[:interactionData].collect { |data|
					data[:experimentRef]
				}
			}
			exp_ids.flatten!

			full_experiments << get_experiments(inner_xml_doc, exp_ids)

#			full_interactions = full_interactions + interactions_subset
			full_interactions = merge_interactions(interactions_subset, full_interactions)

			full_interactions
		} # EO main_interactions each

=begin
puts "\nedges_counter before building graph:\n"
@edges_counter.each_pair { |key,val|
	puts "#{key.to_s} -> #{val.to_s}\n"
}
=end
		super_graph = buildup_graph(full_experiments, main_interactors, full_interactions)
# puts "\n#{super_graph.to_json}\n\n"

#		full_interactions
		super_graph
	end # EO get_super_graph_interaction




	private
	@edges_counter # = Hash.new
	@node_data #  = {"$color" => "blue", "$type"=>"circle", "$dim" => 7}


	def def_interactor (elem)
		shortLab = elem.css('/names/shortLabel').text
		desc = elem.css('/names/fullName').text
		intr_type = elem.css('/interactorType/names/shortLabel').text
		intr_id = "node"+elem['id']

		interactor = {:id => intr_id, :name => shortLab, :desc => desc, :type => intr_type}
	end



# Build an interators list (an Array) out of a Intact xml document
# @param xmlDoc a Intact xml document as a Nokogiri object
# @return an Array with the found interactors
	def build_interactors (xmlDoc)
		interactors = Array.new
		interactorList = xmlDoc.css('interactor')
		interactorList.each { |elem|
			interactor = def_interactor(elem)
			if interactors.index(interactor).nil?
				interactors << interactor
			end
			#	interactionList = xmlDoc.css('interaction')
		}

		interactors
	end




# Scan the document y gets only the nodes which are already within the set of nodes
# @param xmldoc, the Intact xml document
# @param sset, the set of nodes which the new nodes have to be in
# @return an array containing a nodes which are included in the subset
	def get_interactors_subset (xmldoc, set)
		new_subset = Array.new

		interactor_list = xmldoc.css('interactor')
		interactor_list.each { |elem|
			interactor = def_interactor(elem)

			set.each { |the_elem|
				if the_elem[:name] == interactor[:name] && new_subset.index(interactor).nil?
					new_subset << interactor
					break
				end
			}
		} # EO interactor_list

		new_subset
	end



# Builds up a hash with the properties for the experiment exp
# @param exp, a portion of the intact xml25 result representing the experiment
# @return a Hash filled with experiment properties
	def def_experiment (exp)
		exp_type = exp.css('/names/shortLabel').text
		desc = exp.css('/names/fullName').text
		detection = exp.css('/interactionDetectionMethod/names/shortLabel').text
		exp_id = "exprmnt"+exp['id']
		bibref = exp.css('/bibref/xref/primaryRef[@db="pubmed"]')[0]
		if bibref.nil? == false
			pubmed_id = bibref.get_attribute('id')
			pubmed_id = pubmed_id.nil? ? '' : pubmed_id
		else
			pubmed_id = ''
		end
		experiment = {:id => exp_id, :type => exp_type, :detection => detection,
									:desc => desc, :pub_id => pubmed_id}
	end



# Builds up an array with all experiments elements found inside the xml25 intact
# file/response. The experiments will be Hash(es) with their properties
# @param xmlDocu, the xml25 intact document
# @return, an Array filled with Hash elements representing the experiment list
	def get_experiments (xmlDocu, exp_ids = [])
		experiments = Array.new
		expList = xmlDocu.css('experimentDescription')
		expList.each { |exp|
			exp_id = exp.get_attribute('id')
			if exp_ids.index(exp_id).nil? == false
				experiment = def_experiment(exp)
				experiments << experiment
			end
		}

		experiments
	end



# Defines an interaction from a Nokogiri::XML element from the xml document
# @param intrcn, the nokogiri element to be manipulated
# @result an adjacency hash ready to be transformed into a json string
	def def_interaction (intrcn, conf_threshold)
		color = get_random_color
		conn_nodes = intrcn.css('/participantList/participant/interactorRef')
		exprmnt_ref = intrcn.css('/experimentList/experimentRef').text
		msg = intrcn.css('/confidenceList/confidence/unit/names/fullName').text
		conf_name = intrcn.css('/confidenceList/confidence/unit/names/shortLabel[text()=intact-miscore]')
		conf_val = conf_name.first().nil? ? 0.0: conf_name.first().parent().parent().parent().css('value').text
#		conf_val = intrcn.css('/confidenceList/confidence/value').text

# Don't include this interaction if conf_val is less than a threshold
#		if conf_val.to_f < CONFIDENCE_VAL_THRESHOLD || conn_nodes[0].text == conn_nodes[1].text
		if conf_val.to_f < conf_threshold || conn_nodes[0].text == conn_nodes[1].text
# puts "confidence val for #{conn_nodes[0].text}-#{conn_nodes[0].text} is #{conf_val}\n"
			return nil
		end

		edge_counter = @edges_counter[[conn_nodes[0].text, conn_nodes[1].text]]
		#puts "edge_counter: #{edge_counter}\n"
		if edge_counter.nil?
			@edges_counter[[conn_nodes[0].text, conn_nodes[1].text]] = 1
		else
			@edges_counter[[conn_nodes[0].text, conn_nodes[1].text]] = edge_counter + 1
		end

		adjacency = {
			:nodeFrom => conn_nodes[0].text,
			:nodeTo => conn_nodes[1].text,
			:data => {"$color" => color},
			:interactionData => [{
				:experimentRef => exprmnt_ref,
				:confidenceVal => conf_val,
				:conf_desc => msg
			}]
		}
		#	$edges_counter.each { |k, v| puts "#{k} -> #{v}\n" }
		#		adjacencies << adjacency

	end



# Just gets all interaction from an Intact psi-mi 2.5 xml file by accessing
# all interaction elements
# @param xmlDoc, the xml document as a nokogiri::XML object
# @return an Array with all interactions retrieved as Hash objects
	def build_interactions (xmlDoc, conf_thr)
		interactionList = xmlDoc.css('interaction')
		adjacencies = Array.new
		color = "white"
		interactionList.each { |intr|
			adjacency = def_interaction(intr, conf_thr)
			next if adjacency.nil?

			adj_index = adjacencies.index {|adj|
				adj[:nodeFrom] == adjacency[:nodeFrom] && adj[:nodeTo] == adjacency[:nodeTo]
			}

			if adj_index.nil?
				adjacencies << adjacency

			else
				the_adj = adjacencies[adj_index]
				the_adj[:interactionData] << adjacency[:interactionData][0]
			end
		}

		adjacencies
	end


# Merge the interactions for some current element into the full interactions array
# As the interactions are suppossed to be without direction, an interaction
# between x and y will be rejected if the interaction between y and x is already
# held as a valid interactions
# @param current, the interactions for the current element
# @param full, the array of the interactions retrieved so far
# @return a new Array with the new interactions merged into the old ones
	def merge_interactions (current, full)
		result = Array.new

		current.each { |intrct|
# this is necessary in order to see what check failed
			cross_node_check1 = false
			cross_node_check2 = false
			index_full = full.index { |node|
				cross_node_check1 = (intrct[:nodeFrom] == node[:nodeTo] && intrct[:nodeTo] == node[:nodeFrom])
				cross_node_check2 = (intrct[:nodeTo] == node[:nodeFrom] && intrct[:nodeFrom] == node[:nodeTo])

				(intrct[:nodeFrom] == node[:nodeFrom] && intrct[:nodeTo] == node[:nodeTo]) ||
				cross_node_check1 || cross_node_check2
			}

			if index_full.nil?
				result << intrct
				full << intrct

			elsif cross_node_check1
				node = full[index_full]
				num_edges4current = @edges_counter.delete([intrct[:nodeFrom],intrct[:nodeTo]])
				@edges_counter[[node[:nodeFrom],node[:nodeTo]]] += num_edges4current
				full[index_full][:interactionData].concat(intrct[:interactionData])

			elsif cross_node_check2
				node = full[index_full]
				num_edges4current = @edges_counter.delete([intrct[:nodeTo],intrct[:nodeFrom]])
				@edges_counter[[node[:nodeTo],node[:nodeFrom]]] += num_edges4current
				full[index_full][:interactionData].concat(intrct[:interactionData])

			else # same interaction got out of another experiment
				node = full[index_full]
				num_edges4current = intrct[:interactionData].length
				@edges_counter[[node[:nodeFrom],node[:nodeTo]]] += num_edges4current
				full[index_full][:interactionData].concat(intrct[:interactionData])
			end
		} # EO current.each

		full
#		result
	end



# Search inside de document for interactions including ONLY nodes in the subset
# @param xmldoc, the intact xml document representing the interaction 'net'
# @param nodes_subset, the subset of nodes selected for this document
# @return, an array with the interactions involving only nodes in the subset
	def get_interactions_subset (accession, xmldoc, nodes_subset, conf_threshold)
		all_interactions = build_interactions(xmldoc, conf_threshold)


		nodes_id = nodes_subset.collect { |a_node| a_node[:id].slice(4, a_node[:id].length-4) }
		#	nodes_id.each { |id| puts "#{id}\n" }

		right_interactions = Array.new
		all_interactions.each { |new_int|
			node_from = new_int[:nodeFrom]
			node_to = new_int[:nodeTo]

			if nodes_id.index(node_from).nil? == false &&
				 nodes_id.index(node_to).nil? == false
				right_interactions << new_int
			end
		}
=begin
puts "Fucking right interactions...\n"
right_interactions.each { |right_int|
	puts "#{right_int.to_s}\n"
}
=end
		right_interactions
	end


	# INTERACTIONS
=begin
	{
	  "adjacencies": [{
	    "nodeTo": "graphnode5",
	    "nodeFrom": "graphnode2",
	    "data": {
	      "$color": "#909291"
	    }
	  }, {
	    "nodeTo": "graphnode9",
	    "nodeFrom": "graphnode2",
	    "data": {
	      "$color": "#557EAA"
	    }
	  }, {
	    "nodeTo": "graphnode18",
	    "nodeFrom": "graphnode2",
	    "data": {
	      "$color": "#557EAA"
	    }
	  }],
	  "data": {
	    "$color": "#416D9C",
	    "$type": "circle",
	    "$dim": 7
	  },
	  "id": "graphnode2",
	  "name": "graphnode2"
	},
=end



# To build up the graph
# Get an interactor
# Fetch all interations where interactor is in from
# Add to interaction arrays
	def buildup_graph (experiments, nodes, edges)

		graph_cfg = Array.new
		edges_counter = @edges_counter
		min_edges_value = edges_counter.values.min

puts "*****==> edges count is #{edges.length}\n"
		nodes.each { |node|
			node_cfg = Hash.new
			node_id = node[:id].slice(/\d+/)

			node_edges = edges.select { |e| e[:nodeFrom] == node_id }
			node_edges.each { |n|
				line_width = edges_counter[[n[:nodeFrom], n[:nodeTo]]] / min_edges_value
				line_width = line_width.round
				line_width = line_width > MAX_EDGE_WIDTH ? MAX_EDGE_WIDTH: line_width
				# puts "line_width: #{line_width} for #{n[:nodeFrom]},#{n[:nodeTo]}\n"

				if line_width != nil
					n[:data]['$lineWidth'] = line_width
					edges_counter.delete([n[:nodeFrom], n[:nodeTo]])
				end
			}

			color_node = get_random_color()
			@node_data["$color"] = color_node
			@node_data["type"] = node[:type]
			@node_data["node_desc"] = node[:desc]
			node_cfg[:data] = @node_data.clone
			node_cfg[:adjacencies] = node_edges
			node_cfg[:id] = node_id
			node_cfg[:name] = node[:name]

			#		puts "\n#{node_cfg.to_json}\n"
			graph_cfg << node_cfg
		} # EO nodes.each

#		graph_cfg << {:experiments => experiments}
			#		puts "graph_cfg:\n"
			#		puts "\n#{graph_cfg.to_json}"

		graph_cfg
	end



	def get_random_color
		letters = '0123456789ABCDEF'.split('');
		color = '#';
		prng = Random.new
		for i in 0...6
			prng.seed
			color += letters[(prng.rand * 15).round];
		end
		color
	end


#
# This method does a get request to an uri
# @param url, the target url
# @param options, parameters and other options for the request
# @return the object response
#
	def request(url, options)
		puts "IntactProxy.request (#{url}, #{options.inspect})\n"
		my_url = URI.parse(url)

		req = Net::HTTP::Get.new(my_url.request_uri)
		res = Net::HTTP.start(my_url.host, my_url.port) { |http|
			http.request(req)
		}

# puts "response code: #{res.code}"
		res
	end


end