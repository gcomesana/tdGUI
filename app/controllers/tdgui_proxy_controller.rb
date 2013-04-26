


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
# Get the rest of information from conceptwiki based on the collected uuids
		uuids_arr.each { |uuid|
			next if uuid.nil?
			options = Hash.new
			api_method = 'proteinInfo'
			prot_uri = 'http://www.conceptwiki.org/concept/'+uuid
			options[:uuid] = uuid
			options[:uri] = '<' + prot_uri + '>'
			options[:limit] =  params[:limit]
			options[:offset] = params[:offset]
			api_call = CoreApiCall.new
			results = api_call.request( api_method, options)

			json_result = JSON.parse(results) rescue nil
			result_topic = json_result['result']['primaryTopic'] rescue nil
			# resulta_match is an array with undefined, unordered number of hash elements
			result_match = result_topic['exactMatch'] rescue nil

# results is now a json string (from OPS api)
			if (results.nil? || results.empty?) && accs[index_uuid] == '-'
				index_uuid += 1

			elsif (results.nil? || results.empty?) && accs[index_uuid] != '-'
				index_ops += 1
				index_uuid += 1

			elsif results.nil? == false && results.empty? == false && accs[index_uuid] == '-'
				concept_item = Hash.new
				if json_result.nil? == false
					concept_item['proteinFullName'] = result_topic['prefLabel'] unless result_topic['prefLabel'].nil?
					function_got = false
					organism_got = false

					if result_match.nil? == false
						result_match.each { |el|
							if el.is_a?(Hash)
								el.each { |k, v|
									if k == 'Function_Annotation'
										uniprot_item['function'] == v
										function_got = true
									end
									if k == 'organism'
										concept_item['organismSciName'] = v
										organism_got = true
									end
								}
							end
							break if function_got && organism_got
						}
					end

					concept_item['pdbImg'] = "<img src=\"/images/target_placeholder.png\" width=\"80\" height=\"80\" />"
					concept_item['genes'] = []
					concept_item['accessions'] = []
				end

				json_entries['ops_records'].insert(index_ops, concept_item)
				json_entries['totalCount'] += 1

				index_ops += 1
				index_uuid += 1

			elsif results.empty? == false && accs[index_uuid] != '-'
				uniprot_item = json_entries['ops_records'][index_ops]
				uniprot_item['proteinFullName'] = result_topic['prefLabel'] unless result_topic['prefLabel'].nil?
				if result_match.nil? == false
					result_match.each { |el|
						if el.is_a?(Hash)
							el.each { |k, v|
								if k == 'Function_Annotation'
									uniprot_item['function'] == v
									break
								end
							}
						end
					}
				end

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
	def interactions_retrieval (target_id = params[:target], max_nodes = params[:max_nodes],
		conf_val = params[:conf_val])
		intact_proxy = TdguiProxy.new

		conf_param = params[:conf_val] # string!!!
		conf_val = conf_param.to_f
		max_nodes_param = params[:max_nodes] ? params[:max_nodes].to_i : 0
puts "Getting interactions for '#{params[:target]}' from Intact with conf_val=#{params[:conf_val]} & max_nodes=#{params[:max_nodes]}\n"
		return '[]' unless params[:target] != nil && params[:target] != ''
#		graph = stringdb_proxy.get_target_interactions(target_id)
		graph = intact_proxy.get_target_interactions(params[:target], conf_val,
																								 max_nodes_param)
		render :json => graph.to_json, :layout => false
	end



# Gets a uniprot target out of a name. This action is involved when trying to
# get information about a target from uniprot but only a name exists
# @param [String] target_label the name or label to get the target from uniprot
# @return a json string
	def get_uniprot_by_name (target_label = params[:label], target_uuid = params[:uuid])

		proxy = TdguiProxy.new
#		return '[]' unless target_label != nil && target_label != ''

		entry_hash = proxy.get_uniprot_by_name(target_label, target_uuid)

		render :json => entry_hash.to_json, :layout => false
	end


# Gets a uniprot target out of a accession. It makes a simple get request to uniprot
# @param [String] target_acc the accesion to get the target from uniprot
# @return a json string
	def get_uniprot_by_acc (target_acc = params[:acc])
		proxy = TdguiProxy.new
		return '[]' unless target_acc != nil && target_acc != ''

		entry_hash = proxy.get_uniprot_by_acc(target_acc)

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



	def get_pharm_count (uri = params[:uri])
		pharm_proxy = TdguiProxy.new

		res = pharm_proxy.get_pharm_count uri
		render :json => res.to_json, :layout => false
	end



	def get_pharm_by_target_page (uri = params[:uri], page = params[:page], num_results=params[:pagesize])
		pharm_proxy = TdguiProxy.new

		resp = pharm_proxy.get_pharm_results_by_page(uri, page, num_results)
		render :json => resp.to_json, :layout => false
	end


end
