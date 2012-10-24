
module InteractionsUtil

	MAX_INTERACTORS = 5

# The array is preserved in the instance variable @stack and made accessible
# through this method. Access to @interactions_list is not possible at all
# @return [Array] the array with the interaction hash structures
	def interactions_list
		@interactions_list ||= [] # similar to a = a || []
	end


	def get_interactions
		interactions_list
	end



# Builds up a hash object with the interaction parameters out of an array of strings
# This is addressed to convert a line in a MITAB2.5 file into a Hash structure keeping
# the relevatan attributes. The line should be converted previously by
# cols = line.split('\t')
# @param [Array] cols, an array of the row fields taken from the file
# @return [Hash] a hash object structured with the interesting parameters
	def buildup_interaction (cols)
		if cols.length < 31
			nil
		end

		acc1 = cols[0][/[A-Z0-9]{6}/]
		ebi1 = cols[0][/EBI\-(\d){,6}/]
		acc2 = cols[1][/[A-Z0-9]{6}/]
		ebi2 = cols[1][/EBI\-(\d){,6}/]

		tax1 = cols[9][6..cols[9].length]
		tax2 = cols[10][6..cols[10].length]

		conf_val = cols[14][15..cols[14].length].to_f

		intr1 = {:uniprot => acc1, :ebi => ebi1, :altIds => cols[2], :aliases => cols[4], :taxId => tax1}
		intr2 = {:uniprot => acc2, :ebi => ebi2, :altIds => cols[3], :aliases => cols[5], :taxId => tax2}
		link = {:edgeid => cols[13], :confVal => conf_val, :detect => cols[6], :pubmed => cols[8], :type => cols[11]}
		interaction = {:a => intr1, :b => intr2, :edge => link}
	end



# Rebuild interactions from a database resultset by setting an structure as following:
# intr1: uniprotid1
# intr2: uniprotid2
# interactions: [{interactionid: value, conf_val: conf_val}, ..., {}]
# @param [Array] rs the result set of a db query
# @return [Array] an array of hashes as described above
	def rebuild_interactions (rs, max_interactors = MAX_INTERACTORS)
		new_rs = Array.new
		rs.each { |row|
			intr1 = row["uniprot1id"]
			intr2 = row["uniprot2id"]

			exist_intr = new_rs.select { |elem|
				(elem[:intr1] == intr1 && elem[:intr2] == intr2) ||
				(elem[:intr1] == intr2 && elem[:intr2] == intr1)
			}
			if exist_intr.empty? && new_rs.length < max_interactors
				info_hash =  {:conf_val => row["conf_value"], :intr_id => row["interactionid"]}
				new_rs << {:intr1 => intr1, :intr2 => intr2, :info => Array.[](info_hash)}
			elsif exist_intr.empty? == false
				index_elem = new_rs.index(exist_intr[0])
				new_elem = {:conf_val => row["conf_value"], :intr_id => row["interactionid"], :pubmed => row["pubmed"]}
				new_rs[index_elem][:info] << new_elem
			end

		}
		new_rs

	end



# Gets the target's direct neighbours by scan the array of direct interactions
# and collect the ids of the interactions which aren't equal to the target
# @param [Array] target_interactions array of hashes where each element is an
# interaction between 2 targets
# @param [String] target the main target
# @return [Array] an array of strings with the targets uniprot accessions
	def get_neighbours (target_interactions, target)
		neighbours = target_interactions.collect { |elem|
			elem[:intr1] == target ? elem[:intr2]: elem[:intr1]
		}

		neighbours = neighbours.uniq
		neighbours
	end


# Build up an array of hashes out of a database resultset (Array of DBI::Row)
# The result structure will be the same as that defined in rebuild_interactions
# @param [Array] neighbour_rs the resultset with interactions among target's neighbours
# @return [Array] an array of hashes with interactions structured
	def rebuild_neighbour_interactions (neighbour_rs)
		new_rs = self.rebuild_interactions(neighbour_rs, 200)
	end



# Return an array as result of concat a number of arrays or objects
# @param [Array] *args a number of things to concat into a single array
# @return [Array] an array containing all arguments
	def array_concat (*args)
		full = Array.new
		args.each { |item|
			full << item
		}

		full.flatten!
		full
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


# Buildup a graph ready to feed the JIT Force graph (www.thejit.org)
# @param [Array] fullnet an array of hashes where each element represents an interaction
#	def buildup_graph (fullnet)
#	end

end