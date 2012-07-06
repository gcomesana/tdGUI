
require 'net/http'
require 'uri'
require 'cgi'

require 'nokogiri'
require 'JSON'

class IntactProxy

	STRING_DB_URL = 'http://string-db.org/api/psi-mi/interactions?identifier=xxxx&required_score=900&limit=5&network_flavor=confidence'
	INTACT_URL = 'http://www.ebi.ac.uk/Tools/webservices/psicquic/intact/webservices/current/search/query/xxxx?format=xml25&species=9606'

	def initialize
		@edges_counter = Hash.new
		@node_data = {"$color" => "blue", "$type"=>"circle", "$dim" => 7}
	end




	def get_interaction_graph (target_id = 'Q13362')

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
		interactors.each {|intrctr| puts("#{intrctr.to_json}\n") }


		interactionList = xmlDoc.css('interaction')
		adjacencies = Array.new
		color = "white"
		interactionList.each { |intr|

			adjacency = def_interaction (intr)
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



private
	@edges_counter # = Hash.new
	@node_data #  = {"$color" => "blue", "$type"=>"circle", "$dim" => 7}

	def def_interactor (elem)
		shortLab = elem.css('/names/shortLabel').text
		desc = elem.css('/names/fullName').text
		intr_type = elem.css('/interactorType/names/shortLabel').text
		intr_id = "node"+elem['id']

		interactor  = {:id => intr_id, :name => shortLab, :desc => desc, :type=>intr_type}
	end

	def def_experiment (exp)
		exp_type = exp.css('/names/shortLabel').text
		desc = exp.css('/names/fullName').text
		detection = exp.css('/interactionDetectionMethod/names/shortLabel').text
		exp_id = "exprmnt"+exp['id']

		experiment = {:id => exp_id, :type=>exp_type, :detection=>detection, :desc => desc}
	end


	def def_interaction (intrcn)
		color = "white"
		conn_nodes = intrcn.css('/participantList/participant/interactorRef')
		exprmnt_ref = intrcn.css('/experimentList/experimentRef').text
		msg = intrcn.css('/confidenceList/confidence/unit/names/fullName').text
		conf_val = intrcn.css('/confidenceList/confidence/value').text
	#	edge_id = intr['id']

# puts "***==> edge is [#{conn_nodes[0].text}, #{conn_nodes[1].text}]\n"
# puts "**===> @edge_counter: #{@edges_counter}\n"
# puts "***==> in this case @edges_counter = #{@edges_counter[[conn_nodes[0].text, conn_nodes[1].text]]}"
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
			:interactionData => {
				:experimentRef => exprmnt_ref,
				:confidenceVal => conf_val,
				:conf_desc => msg
			}
		}
	#	$edges_counter.each { |k, v| puts "#{k} -> #{v}\n" }
	#		adjacencies << adjacency

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
		nodes.each { |node|
			node_cfg = Hash.new
			node_id = node[:id].slice(/\d+/)

			node_edges = edges.select { |e| e[:nodeFrom] == node_id }
			node_edges.each {|n|
				line_width = edges_counter[[n[:nodeFrom],n[:nodeTo]]]
	# puts "line_width: #{line_width} for #{n[:nodeFrom]},#{n[:nodeTo]}\n"

				if line_width != nil
					n[:data]['$lineWidth'] = line_width
					edges_counter.delete( [n[:nodeFrom], n[:nodeTo]] )
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

		graph_cfg << {:experiments => experiments}
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