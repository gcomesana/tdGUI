
require 'rubygems'
require 'dbi'
require 'pg'

require_relative 'interactions_util'
# This is a very custom class to support connection an insertion of
# interaction information into a database.
class IntactDao
	include InteractionsUtil

	MAX_INTERACTORS = 5

	attr_reader :conn, :result_set, :info_interactions, :interaction_net, :server, :port, :db


	def initialize (dbserver, dbport=5432, dbname, dbuser, dbpasswd)
		@server = dbserver
		@port = dbport
		@db = dbname

		@result_set = Array.new
		@interaction_net = Array.new
		@info_interactions = Array.new

		conn_str = "DBI:Pg:dbname="+@db+";host=" + @server + ";port="+@port
print "IntactDao() conn_str: #{conn_str}"
		@conn = DBI.connect(conn_str, dbuser, dbpasswd)
#		@conn = PG.connect({:host => 'localhost', :port => 5432, :user => dbuser, :dbname => dbname, :password => dbpasswd})

		insert_qry = "insert into interactions "
		insert_qry += " (uniprot1id, ebi1id, interactor1alt, interactor1alias, interactor1_taxid, "
		insert_qry += "uniprot2id, ebi2id, interactor2alt, interactor2alias, interactor2_taxid, "
		insert_qry += "interactionid, interaction_type, conf_value, detection_method, pubmed) "
		insert_qry += "values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)"
		@insert_qry = insert_qry.clone

		select_qry = "select * from interactions where (uniprot1id like ? or uniprot2id Like ?) "
		select_qry += "and conf_value >= ? order by conf_value desc"
		@select_qry = select_qry

		multitarget_qry = "select * from interactions "
		multitarget_qry += "where (uniprot1id in (?)) and (uniprot2id in (?)) "
		multitarget_qry += "and conf_value >= ? "
		multitarget_qry += "order by conf_value desc"
		@multitarget_qry = multitarget_qry


	end


	def reset_multitarget_qry
		multitarget_qry = "select * from interactions "
		multitarget_qry += "where (uniprot1id in (?)) and (uniprot2id in (?)) "
		multitarget_qry += "and conf_value >= ? "
		multitarget_qry += "order by conf_value desc"

		@multitarget_qry = multitarget_qry
	end

# Gets a connection to the database
# @param [String] dbserver
# @param [String] dbport
# @param [String] dbname
# @param [String] dbuser
# @param [String] dbpasswd
# @return [Arr]
	def open_conn (dbserver, dbport, dbname, dbuser, dbpasswd)
		if @conn.nil?
			conn_str = "DBI:Pg:dbname="+dbname+";host=" + dbserver + ";port="+dbport
			@conn = DBI.connect(conn_str, dbuser, dbpasswd)
#			@conn = PG.connect({:host => 'localhost', :port => 5432, :user => dbuser, :dbname => dbname, :password => dbpasswd})
		end
	end


# Closes the previously opened connection
	def close_conn
puts "Disconnecting #{@db}...\n"
		if @conn.nil? == false
			@conn.disconnect
			@conn = nil
		end
	end


# Inserts information on an interaction into the database.
# @param [Array] array with the fields got from MITAB2.5 IntAct file
	def insert_interaction (the_fields)

		an_intr = buildup_interaction the_fields
		@conn.do(@insert_qry,
					 an_intr[:a][:uniprot], an_intr[:a][:ebi], an_intr[:a][:altIds], an_intr[:a][:aliases], an_intr[:a][:taxId],
					 an_intr[:b][:uniprot], an_intr[:b][:ebi], an_intr[:b][:altIds], an_intr[:b][:aliases], an_intr[:b][:taxId],
					 an_intr[:edge][:edgeid], an_intr[:edge][:type], an_intr[:edge][:confVal], an_intr[:edge][:detect], an_intr[:edge][:pubmed]
		)

	end


# Fetches the all interactions for a target defined by its uniprot accession. The
# resultset is gross, no interactions screening targeted to build up the json
# graph is done in this stage
# @param [String] uniprot_acc
# @param [Integer] max_interactions, maximun number of interactions to db
# @param [Float] conf_val, the confidence value threshold for the interactions
# @return [Array] an array with all fetched rows
	def fetch_interactions (uniprot_acc, conf_val = 0.5)
#		sth = dbh.execute("SELECT * FROM people WHERE name = ?", "Na'il")
		open_conn(@server, @port, @db, 'intact', '1ntakt')
		sth = @conn.execute(@select_qry, uniprot_acc, uniprot_acc, conf_val)
		row_cont = 0

		rs_clear()
		sth.fetch do |row|
#		  printf "ID: %d, Name: %s, Height: %.1f\n", row[0], row[1], row[2]
#			printf "interactionid: %s, %s -> %s (%.2f)\n", row[11], row[1], row[6], row[12]
			row_cont += 1
			@result_set << Marshal.load(Marshal.dump(row))
		end
		sth.finish
#		uniques(rs)
		row_cont
	end


# Fetches the interactions among multiple targets, representing a closed network
# among themselves
# @param [Array] nodes, uniprot accessions for the target nodes
# @param [Float] conf_val, the confidence value to screen weak interactions
# @return [Array] an array with the interactin rows
	def fetch_neighbours_interactions (neighbours, conf_val = 5)
		neighbours.map! {|name|
			"'"+name+"'"
		}
		neighbour_str = neighbours.join(',')

# Set a binding parameter for the list of uniprot accessions does not work
# So, it has to be made in an old-fashioned way
		qm_index = @multitarget_qry.index('?')
		@multitarget_qry[qm_index] = neighbour_str
		qm_index = @multitarget_qry.index('?')
		@multitarget_qry[qm_index] = neighbour_str
		qm_index = @multitarget_qry.index('?')
		@multitarget_qry[qm_index] = conf_val.to_s

		open_conn(@server, @port, @db, 'intact', '1ntakt')

		row_count = 0

		sth = @conn.execute(@multitarget_qry)
		@interaction_net.clear
#		rows = sth.fetch_all
		sth.fetch do |row|
			row_count += 1
			@interaction_net << Marshal.load(Marshal.dump(row))

		end
		sth.finish
		reset_multitarget_qry

		row_count
	end






# Clears the result set array
	def rs_clear
		@result_set.clear
	end

end