require 'json'
# require_relative 'interactions_util'
# require_relative 'intact_dao'
require 'intact/intact_dao'
require 'intact/interactions_util'

# This is the factory to build up the json feed for the JIT Force Directed Graph
class JitGraph
	include InteractionsUtil

	attr_reader :graph, :dao, :uniprot_acc

	def initialize
		@graph = []
		@dao = nil
		@node_data = {:data =>
			{"$color" => "#A29A32",  "$type" => "circle",  "$dim" => 7,  "node_desc" => ""}
		}
		@uniprot_acc = nil
	end


# Initializes the database object access
# @param [String] server
# @param [String] port
# @param [String] dbname
# @param [String] user
# @param [String] passwd
	def set_db_params (server, port, dbname, user, passwd)
		@dao = IntactDao.new server, port, dbname, user, passwd
	end



# Develops all steps to yield a valid jit graph out of a uniprot accession
# @param [String] uniprot_acc an uniprot accession to build up the interaction network
# @return [Array] an array of nodes plus their interactions, ready to be converted into json
	def yield_graph (uniprot_acc, conf_val=0.5, max_interactors=MAX_INTERACTORS)
		interactions = get_interactions(uniprot_acc, conf_val, max_interactors)
		interactors = yield_interactors(interactions)

		interaction_net = Array.new

#		interactions_used = Array.new
		interactors.each_index { |ix|
			node = {:id => ix, :name => interactors[ix]}
			my_color = get_random_color
			node_type = interactors[ix] == uniprot_acc ? "star": "circle"
			node_dim = interactors[ix] == uniprot_acc ? 10: 7
			node_data = {"$color" => my_color, "$type" => node_type,
									 "$dim" => node_dim, :node_desc => ""}

			sub_interactions = get_interactions4node(interactions, interactors[ix])
			adjacencies = build_graph_adjacencies(sub_interactions, interactors)

			interaction = {:id => (ix+1), :name => interactors[ix], :adjacencies => adjacencies,
											:data => node_data}

			interaction_net << interaction
		}
		interaction_net
	end




# Yield an array of hashes where each element represents the interactions between two targets
# @param [String] uniprot_acc the uniprot accession
# @param [Float] conf_val teh confidence value to screen the interactions
# @param [Integer] max_interactors the number of maximun interactors in the interaction net
# @return [Array] an array of hashes where every element represents an interaction
	def get_interactions (uniprot_acc, conf_val=0.5, max_interactors=MAX_INTERACTORS)
		@uniprot_acc = uniprot_acc
		num_rows = @dao.fetch_interactions(uniprot_acc, conf_val)
		return [] if num_rows == 0

		direct_interations = rebuild_interactions(@dao.result_set, max_interactors)
		return [] if direct_interations.length == 0

		neighbours = get_neighbours(direct_interations, uniprot_acc)
		num_rows = @dao.fetch_neighbours_interactions(neighbours, conf_val)
		neighbours_interactions = rebuild_neighbour_interactions(@dao.interaction_net)

		full_interactions = array_concat(direct_interations, neighbours_interactions)
	end


# Yields an array containing the uniprot ids for the interactors. The necessary
# ids for the interactors for the JIT json feed will be the index of the elements
# @param [Array] interactions_ary the array with all interactions
# @return [Array] an array with the uniprot accessions of the interactors involved
# in the interactions hold in the interactions_ary array
	def yield_interactors (interactions_ary)
# The interactions is an array where each item is
# {:intr1=>intr1, :intr2=>intr2, :info => [{conf_val, intrc_id},...,{}]}
# we need an id for each node
		node_ids = Array.new
		interactions_ary.each { |item|
			if node_ids.index(item[:intr1]).nil?
				node_ids << item[:intr1]
			end

			if node_ids.index(item[:intr2]).nil?
				node_ids << item[:intr2]
			end
		}
		node_ids.compact!
		node_ids
	end


# Gets the interactions where this node is represented by the first node in the interactoins
# @param [Array] interaction_set the array of all interactions
# @param [String] node the uniprot accession for the node
# @return [Array] an array of interactions where node is in first place (would be kind of origin)
# The elements of the array will be hashes like:
# { :intr1, :intr2, :info=>[{:conf_val, :interactionid}] }
	def get_interactions4node (interaction_set, node)
		sub_interactions = interaction_set.collect { |elem|
			if elem[:intr1] == node
				elem
			end
		}
		sub_interactions.compact!
		sub_interactions
	end



private

# Builds an array with all interactions for a node, defined by node_interactions. This one
# will be the 'adjacencies' property for a node in the json configuration for the JIT FD graph
# @param [Array] node_interactions this is a subset of the full interaction set,
# where the first node (kind of origin) is always the same. So, this interaction subset
# represents interactions from one node to whatever else
# @param [Array] interactors the array of the interactors, will be uniprot accessions
# @return an array of interactions ready to be converted in a valid JSON for jit.org FD graph
	def build_graph_adjacencies (node_interactions, interactors)
		adjacencies = Array.new
		node_interactions.each { |elem|
			node_from = interactors.index(elem[:intr1])+1
			node_to = interactors.index(elem[:intr2])+1

			line_color = get_random_color()
			line_width = elem[:info].length
			data = {"$color" => line_color, "$lineWidth" => line_width}

			interaction_data = Array.new
			elem[:info].each {|info|
# puts "pubmed: #{info[:pubmed]}\n"
				intr_ids = info[:intr_id].split('|')
				intact_id = intr_ids[0][intr_ids[0].index(':')+1..intr_ids[0].length]
				last_index = intr_ids.index('(').nil? ? intr_ids.length: intr_ids[1].rindex('(')-1
				iref = intr_ids[1][intr_ids[1].index(':')+1..last_index]
				interaction_data << {:confidenceVal => info[:conf_val],
														 :intactid => intact_id, :iref => iref, :pubmed => (info[:pubmed].nil? ? "": info[:pubmed])}
			}
			adjacencies << {:nodeFrom => node_from, :nodeTo => node_to,
											:data => data, :interactionData =>  interaction_data}
		}
		adjacencies

	end


end