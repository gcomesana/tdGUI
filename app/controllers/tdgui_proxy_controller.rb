

# This is a 'custom' controller (which means is not derived from CoreGUI controllers)
# to perform the actions triggered from application interface
class TdguiProxyController < ApplicationController

# Test action. Call it from consoles as app.get '/tdgui_proxy/test?q=ping-back'
# @param [String] myparam this is the param which will be returned
	def test (myparam = params[:q]) #
		myparam = myparam ? myparam: "nillllllll"

		render :json => {'res' => "tdguiProxy Controller myparam #{myparam} ok"}.to_json, :layout => false

	end



# Gets multiple entries from uniprot and renders a json document with the most
# "interesting" attributes
# @param [String] entries_query a comma separeted list of accessions, string classed
# @return [String] just a json string in order to be processed by the client
	def multiple_entries_retrieval (entries_query = params[:entries])

#		entries = {:uniprotIds => ['Q13362','P12345','P0AEN3','P0AEN2','P0AEN1']}

#		entries = ['Q13362','P12345','P0AEN3'] unless entries.empty?
#		uuids_query = params[:uuids]

		targetIds = entries_query.split(',')
		accs = targetIds.collect { |tid| mytid = tid.split(';'); mytid[0] }
		uuids_arr = targetIds.collect { |tid| mytid = tid.split(';'); mytid[1] }

		tdgui_proxy = TdguiProxy.new
		json_entries = tdgui_proxy.get_multiple_entries(accs.join(','))
puts "json_entries: #{json_entries}\n"


#		uuids_arr = uuids_query.split(',')
		index_ops = 0
		index_uuid = 0
		uuids_arr.each { |uuid|
			options = Hash.new
			api_method = 'proteinInfo'
			prot_uri = 'http://www.conceptwiki.org/concept/'+uuid
			options[:uri] = '<' + prot_uri + '>'
			options[:limit] =  params[:limit]
			options[:offset] = params[:offset]
			api_call = CoreApiCall.new
			results = api_call.request( api_method, options)

# Fusion the information got from uniprot with info we gotta get from coreAPI (if existing, if working)
			if results[0].empty? && accs[index_uuid] == '-'
				index_uuid += 1

			elsif results[0].empty? && accs[index_uuid] != '-'
				index_ops += 1
				index_uuid += 1

			elsif results[0].empty? == false && accs[index_uuid] == '-'
				concept_item = Hash.new
				concept_item['proteinFullName'] = results[0][:target_name]
				concept_item['function'] = results[0][:description]
				concept_item['organismSciName'] = results[0][:organism]
				concept_item['pdbImg'] = "<img src=\"/images/target_placeholder.png\" width=\"80\" height=\"80\" />"
				concept_item['genes'] = []
				concept_item['accessions'] = []

				json_entries['ops_records'].insert(index_ops, concept_item)
				json_entries['totalCount'] += 1

				index_ops += 1
				index_uuid += 1

			elsif results[0].empty? == false && accs[index_uuid] != '-'
				uniprot_item = json_entries['ops_records'][index_ops]
				uniprot_item['proteinFullName'] = results[0][:target_name] unless results[0][:target_name].empty?
				uniprot_item['function'] = results[0][:description] unless results[0][:description].empty?
#				uniprot_item[:organismSciName] = results[0][:organism] unless results[0][:organism].empty?

				index_uuid += 1
				index_ops += 1
			end

#	puts "protein_info resutls: #{results.to_s}\n"
		}
		render :json => json_entries, :layout => false
	end



# Gets the interactions for this target from intact.
# The interactions are actually
# in this case a json string ready to feed a graph to represent the interactions
# @param [String] target_id the uniprot accession
# @param [Integer] max_nodes the maximun number of nodes in the graph (default is 6)
# @param [Float] conf_val the confidence value. Intact assigns a score to every interaction.
# This parameter is used to screen interactions below this threshold (defautl is 0.5)
# @return [String] the json object to feed the javascript graph
	def interactions_retrieval (target_id = params[:target], max_nodes = 6, conf_val = 0.5)
		intact_proxy = TdguiProxy.new

		conf_param = params[:conf_val]
		conf_val = conf_param.to_f == 0.0 ? conf_val: conf_param.to_f
		max_nodes_param = params[:max_nodes] ? 0: params[:max_nodes].to_i
		max_nodes = max_nodes_param == 0 ? max_nodes: max_nodes_param
puts "Getting interactions from Intact with conf_val=#{conf_val} & max_nodes=#{max_nodes}\n"
		return '[]' unless target_id != nil && target_id != ''
#		graph = stringdb_proxy.get_target_interactions(target_id)
		graph = intact_proxy.get_target_interactions(target_id, conf_val, max_nodes)

		render :json => graph.to_json, :layout => false
	end



# Gets a uniprot target out of a name. This action is involved when trying to
# get information about a target from uniprot but only a name exists
# @param [String] target_label the name or label to get the target from uniprot
# @return a json string
	def get_uniprot_by_name (target_label = params[:label])

		proxy = TdguiProxy.new
		return '[]' unless target_label != nil && target_label != ''

		entry_hash = proxy.get_uniprot_by_name(target_label)

		render :json => entry_hash.to_json, :layout => false
	end


# Sends an email feedback to admin from the feedback window on GUI
# @param [String] from the sender
# @param [String] subject
# @param [String] msg email body
# @return a json object with just a reponse true or false depending on the success (true = success)
	def send_feedback (from = params[:from], subject = params[:subject], msg = params[:msg])
		email_proxy = TdguiProxy.new

		res = email_proxy.send_feedback(from, subject, msg)

		render :json => res ? '{"success": true}': '{"success":false}', :layout => false
	end



end
