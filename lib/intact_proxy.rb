require 'net/http'
require 'uri'
require 'cgi'

require 'nokogiri'
require 'JSON'

require 'intact/jit_graph'
require 'intact/intact_dao'

# This class encapsulates the methods to get an protein interaction networks from
# Intact database (<a href="http://www.ebi.ac.uk/intact" target="_blank">link</a>)
# It builds either a star-topology graph or a one-distance-neighbour interactions graph
class IntactProxy

	STRING_DB_URL = 'http://string-db.org/api/psi-mi/interactions?identifier=xxxx&required_score=900&limit=5&network_flavor=confidence'
	INTACT_URL = 'http://www.ebi.ac.uk/Tools/webservices/psicquic/intact/webservices/current/search/query/xxxx?format=xml25&species=9606'
	CONFIDENCE_VAL_THRESHOLD = 0.4
	MAX_NEIGHBOURS = 6
	MAX_EDGE_WIDTH = 10

	def initialize
# edges_counter counts the number of interactions between two nodes
# it is a hash where the key is an array with a pair of nodes,
# and the value the number of conncections between them
		@edges_counter = Hash.new
		@node_data = {"$color" => "blue", "$type" => "circle", "$dim" => 7}
	end



# get_interaction_graph
# @deprecated Use of {#get_super_interaction_graph} is encouraged as it is more reliable and gets a more complete graph
#
# Builds a star-topology graph out of a uniprot target accession. The returned
# Hash object has to be ready to be converted into a json string ready to be used
# as a data to feed a force directed graph like <a href="http://thejit.org/static/v20/Jit/Examples/ForceDirected/example1.html" target="_blank">this</a>
#
# @param [String] target_id the uniprot accession of the target
# @param [Float] conf_threshold the confidence value threshold: all interactions whose confidence
# value is below this parameter will be discarded
# @return [Hash] a hash object ready to be converted in to a json object suitable
# to configure a force directed graph as indicated above
	def get_interaction_graph (target_id = 'Q13362', conf_threshold = CONFIDENCE_VAL_THRESHOLD,
					num_neighbours = MAX_NEIGHBOURS)
#		xmlFile = File.new('../data/q13362-stringdb-interactions.xml') # psi-mi xml file

#		myuri = INTACT_URL.gsub(/xxxx/, target_id)
		dbhost = TdGUI::Application.config.intactdb.intact_server
		dbport = TdGUI::Application.config.intactdb.intact_port
		dbuser = TdGUI::Application.config.intactdb.intact_user
		dbpasswd = TdGUI::Application.config.intactdb.intact_pass
		dbname = 'intact'

		graph_jit = JitGraph.new
#		dao = IntactDao.new(dbhost, dbport, dbname, dbuser, dbpasswd)
		graph_jit.set_db_params(dbhost, dbport, dbname, dbuser, dbpasswd)
		graph_ary = graph_jit.yield_graph(target_id, conf_threshold, num_neighbours)

		graph_ary
	end



# Builds up a interaction graph starting off a uniprot accession target but getting
# additional first level deep interactions amid the closer neighbors
# @param [String] target_id the main target which the interactions wants to be yield of
# @param [Integer] max_interactors the maximum number of interactors in the graph
# @param [Float] conf_threshold (see #get_interaction_graph)
# @return [Array] an array modelling all interactions
	def get_super_interaction_graph (target_id = 'P77569', max_interactors = 5, conf_threshold = 0.5)
		myuri = INTACT_URL.gsub(/xxxx/, target_id)
		psimiResp = request(myuri, {})
#		intact_file = File.open ('public/resources/datatest/intact/Q13362.xml')
		xmlDoc = Nokogiri::XML(psimiResp.body)
#		xmlDoc = Nokogiri::XML(intact_file)

# main_interactors is an array of hashes
		main_interactors = build_interactors(xmlDoc)
puts "\nmain_interactors:\n#{main_interactors.to_s}\n\n"

		if main_interactors.length == 0
			return []
		end

		full_interactions = Array.new
		full_experiments = Array.new
		main_interactions = get_interactions_subset(xmlDoc, main_interactors, conf_threshold) # main_interactors[0][:name] == target_id
puts "\n#{main_interactions.to_s}\n"

		if main_interactors.length > max_interactors
			main_interactors = screen(main_interactors, main_interactions, conf_threshold, max_interactors)
			return [] unless main_interactors.length > 0
		end
		main_ids = main_interactors.collect { |item| item[:id][4..(item[:id].length-1)] }

		main_accs = Array.new
		main_interactors.each { |intr|
			main_accs << intr[:name]
		}
		intact_xml_resps = perform_intact_reqs(main_accs) # return a Hash {:acc => :http_response}

puts "** main_ids: #{main_ids.to_s}\n"
main_interactors.each { |intrc|
	puts "** interactor: name=#{intrc[:name]} vs id=#{intrc[:id]}\n"
}
puts "** and main_accs: #{main_accs.to_s}\n"

# START loop over main interactors to build the 'supergraph'
		main_interactors.each { |interactor|
			accession = interactor[:name]
=begin
			my_intactUri = INTACT_URL.sub('xxxx', accession)
			xmlstr = request(my_intactUri, [])
			inner_xml_doc = Nokogiri::XML(xmlstr.body)
=end
# thread issue
      xmlstr_thr = intact_xml_resps[accession]
			inner_xml_doc = Nokogiri::XML(xmlstr_thr.body)

=begin
			xmlstrEq = xmlstr_thr.to_s == xmlstr.body
			nokogiriEq = inner_xml_doc == inner_xml_doc_thr
if !xmlstrEq
	diffStr = if xmlstr.body.size <= xmlstr_thr.size
							xmlstr_thr.index(xmlstr.body) == 0? xmlstr_thr[xmlstr.body.size()..xmlstr_thr.size()]: nil
						else
							xmlstr.body.index(xmlstr_thr) == 0? xmlstr.body[xmlstr_thr.size()..xmlstr.body.size()]: nil
						end

	puts "lengths (xmlstr vs xmlstr_thr): #{xmlstr.body.size}vs #{xmlstr_thr.size} => #{diffStr}\n"
end
=end
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
			interactions_subset = get_interactions_subset(inner_xml_doc, new_subset, conf_threshold)

# Convert interactions ids for nodeFrom and nodeTo fields as well as edges_counter references
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

		super_graph = buildup_graph(full_experiments, main_interactors, full_interactions)
puts "\n#{super_graph.to_json}\n\n"

#		full_interactions
		super_graph
	end # EO get_super_graph_interaction




	private
	@edges_counter # = Hash.new
	@node_data #  = {"$color" => "blue", "$type"=>"circle", "$dim" => 7}


# Define an interactor out of an intact xml25 file element
# @param [Nokogori::XML::Element] an xml element
# @return [Hash] a hash object with the values of the node/interactor
	def def_interactor (elem)
		shortLab = elem.css('/names/shortLabel').text
		desc = elem.css('/names/fullName').text
		intr_type = elem.css('/interactorType/names/shortLabel').text
		intr_id = "node"+elem['id']

		interactor = {:id => intr_id, :name => shortLab, :desc => desc, :type => intr_type}
	end



# Build an interators list (an Array) out of a Intact xml document
# @param [Nokogiri::XML::Document] xmlDoc a Intact xml document as a Nokogiri object
# @return [Array] with the found interactors
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
# @param xmldoc (see #build_interactors))
# @param [Array] set the set of nodes which the new nodes have to be in
# @return [Array] a list containing a nodes which are included in the subset
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
# @param [Nokogiri::XML::Element], a portion of the intact xml25 result representing the experiment
# @return [Hash] object filled with experiment properties
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
# @param (see #build_interactors)
# @return [Array] filled with Hash objects, representing the experiment list
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



# Defines an interaction from a XML element from the xml25 intact document
# @param [Nokogiri::XML::Element] intrcn the nokogiri element to be manipulated
# @param (see #get_super_interaction_graph)
# @return [Hash] an adjacency hash ready to be transformed into a json string
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



# Screen the interactions (and interactors) when the number of interactors is
# higher than the max_nodes params and has to be cut.
# Two pretty naïve conditions in order to select nodes:
# - keep the interactions with confidence value greater or equal than threshold
# - if the nodes result is greater than number of nodes, remove the last ones based
# on low number or weak interactions
#
# @param [Array] interactors the set of main interactors (those interactors which are supposed
# to have a interaction with the target)
# @param [Array] interactions the set of interactions with the main target
# @param (see #get_super_interaction_graph)
# @param (see #get_super_interaction_graph)
# @return [Array], an array with the selected nodes
	def screen (interactors, interactions, threshold, max_nodes)

# select interactions with a confidence value greater than threshold
		selected_edges = interactions.select { |intr|
			inner_intr = intr[:interactionData].select { |elem|
				elem[:confidenceVal].to_f >= threshold
			}
			if inner_intr.length > 0
				intr
			end
		}
# sort the edges in order to prioritize the nodes with more edges join them -strong(er) relationship-
		selected_edges.sort! { |e1, e2|
			e2[:interactionData].length <=> e1[:interactionData].length
		}

#	take the single interactions and sort them by the confidence value
# always trying prioritize strong(er) relationships
		single_edges = selected_edges.select { |edge|
			if edge[:interactionData].length == 1
puts "edge: #{edge.to_s}\n"
#				selected_edges.delete(edge)
				true
			end
		}
		selected_edges = selected_edges - single_edges

		single_edges.sort! { |e1, e2|
			e2[:interactionData][0][:confidenceVal] <=> e1[:interactionData][0][:confidenceVal]
		}
		selected_edges = selected_edges + single_edges

# select nodes which have departure edges
		sel_nodes = Array.new
		selected_edges.each { |edge|

			new_nodes = interactors.select { |a_node|
				node_id = a_node[:id].slice(4..(a_node[:id].length-1))
				node_id == edge[:nodeFrom] || node_id == edge[:nodeTo]
#					a_node
			}

			#if sel_nodes.empty?
			#	sel_nodes = sel_nodes + new_nodes
			#else
			#	sel_nodes = sel_nodes.zip(new_nodes).flatten.compact
			#end

			sel_nodes = sel_nodes | new_nodes

			if sel_nodes.length >= max_nodes
				while sel_nodes.length > max_nodes
					sel_nodes.delete_at(sel_nodes.length-1)
				end

				return sel_nodes
			end
		} # EO selected_edges.each

		sel_nodes
	end



# Just gets all interaction from an Intact psi-mi 2.5 xml file by accessing
# all interaction elements
# @param (see #build_interactors)
# @param (see #get_super_interaction_graph)
# @return [Array] a list with all interactions retrieved as Hash objects
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
# @param [Array] current the interactions for the current element
# @param [Array] full the array of the interactions retrieved so far
# @return [Array] a list with the new interactions merged into the old ones
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
# @param (see #build_interactors)
# @param [Array] nodes_subset the subset of nodes selected for this document
# @param (see #def_interaction)
# @return [Array] a set with the interactions involving only nodes in the subset
	def get_interactions_subset (xmldoc, nodes_subset, conf_threshold)
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

		right_interactions
	end


# INTERACTIONS
#
#	{
#	  "adjacencies": [{
#	    "nodeTo": "graphnode5",
#	    "nodeFrom": "graphnode2",
#	    "data": {
#	      "$color": "#909291"
#	    }
#	  }, {
#	    "nodeTo": "graphnode9",
#	    "nodeFrom": "graphnode2",
#	    "data": {
#	      "$color": "#557EAA"
#	    }
#	  }, {
#	    "nodeTo": "graphnode18",
#	    "nodeFrom": "graphnode2",
#	    "data": {
#	      "$color": "#557EAA"
#	    }
#	  }],
#	  "data": {
#	    "$color": "#416D9C",
#	    "$type": "circle",
#	    "$dim": 7
#	  },
#	  "id": "graphnode2",
#	  "name": "graphnode2"
#	},




# Build up the graph out of experiments, nodes and edges. Basic steps:
# 1. Get an interactor
# 2. Fetch all interations where interactor is in from
# 3. Add to interaction arrays
#
# @param [Array] experiments the experiemnts extracted from the intact psi-mi xml file
# @param [Array] (see #build_interactors)
# @param [Array] (see #build_interactions)
# @return [Array] the result graph as an array of hash objects
	def buildup_graph (experiments, nodes, edges)

		graph_cfg = Array.new
		edges_counter = @edges_counter
		min_edges_value = edges_counter.values.min
		nodes_id = Array.new


puts "*****==> edges count is #{edges.length}\n"
		nodes.each { |node|
			node_cfg = Hash.new
			node_id = node[:id].slice(/\d+/)
			nodes_id << node_id

# select the edges with similar origin (always suppossing directed edges)
			node_edges = edges.select { |e| e[:nodeFrom] == node_id }
			node_edges.each { |n|
				num_edges = edges_counter[[n[:nodeFrom], n[:nodeTo]]]

				line_width = num_edges / min_edges_value
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

		graph_cfg = remove_orphans(graph_cfg, nodes_id)
		graph_cfg
	end



# As after manipulating the interactions, due to restrictions on confidence value
# and number of nodes, orphans can raise, we remove it in order to preserve the
# network nature of the interaction web.
# This method returns the graph without orphan nodes
# @param [Array] graph the generated graph
# @param [Array] node_ids the list of node identifier in order to simplify the screening process
# @return [Array] the graph with the orphan nodes removed
	def remove_orphans (graph, node_ids)

		orphans = Array.new
		node_ids.each { |node_id|
			isOrphan = true

			graph.each { |node|
				node[:adjacencies].each { |adj|
					if adj[:nodeFrom] == node_id || adj[:nodeTo] == node_id
						isOrphan = false
						break
					end
				}
				break if isOrphan == false
			}
			orphans << node_id unless isOrphan == false
		}

		orphan_nodes = graph.select { |node|
			orphans.include?(node[:id])
		}

		orphan_nodes.each { |orphan|
			graph.delete(orphan)
		}
puts "\norphans: #{orphans}\n"

		graph
	end



# Gets a random color in order to colorize the nodes
# @return [String] the color in hexadecimal, i.e. #F1F1F1
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



# Performs a concurrent intact requests in order to dramatically decrease the
# response time... lets see
# @param [Array] main_accs array of strings containing the uniprot_acc for the interactors
# @return [Hash] a hash where key is an uniprot accession and value will be the reponse
# got from IntAct for that accession
	def perform_intact_reqs (main_accs)

		threads = []
		responses = Hash.new
		for an_acc in main_accs
	puts "main_accs: #{main_accs.to_s} -> an_acc: #{an_acc}\n"
#			my_intactUri = INTACT_URL.sub('xxxx', an_acc)
#			xmlstr = request(my_intactUri, [])
			threads << Thread.new(an_acc) do |accession|
				my_intactUri = INTACT_URL.sub('xxxx', accession)
				res = request(my_intactUri, [])
				responses[accession] = res
=begin
				inner_start_time = Time.now

				my_url = URI.parse(url)
				print "Fetching: #{url}\n"
				req = Net::HTTP::Get.new(my_url.request_uri)
				resp = Net::HTTP.start(my_url.host, my_url.port) { |http|
					http.request(req)
				}
				responses[an_id] = resp.body
				inner_end_time = Time.now
				inner_elapsed = (inner_end_time - inner_start_time) * 1000
				print "Elapsed time: #{inner_elapsed} ms\n\n"ç
=end
			end

		end # EO for

		threads.each {|thr|
			thr.join
		}

		responses
	end



#
# This method does a http get request to an uri
# @param [String] url the target url
# @param [Hash] options parameters and other options for the request (query string, ...)
# @return [Net::HTTPResponse] the object response
	def request(url, options)
puts "IntactProxy.request (#{url}, #{options.inspect})\n"
		my_url = URI.parse(url)
start_time = Time.now

		proxy_host = 'ubio.cnio.es'
		proxy_port = 3128
		req = Net::HTTP::Get.new(my_url.request_uri)
		res = Net::HTTP.start(my_url.host, my_url.port, proxy_host, proxy_port) { |http|
			http.request(req)
		}
end_time = Time.now
elapsed_time = (end_time - start_time) * 1000
puts "***=> Time elapsed for #{url}: #{elapsed_time} ms\n"
# puts "response code: #{res.code}"
		res
	end


end