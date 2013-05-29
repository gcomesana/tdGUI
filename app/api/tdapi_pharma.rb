
require 'net/http'
require 'uri'
require 'grape-swagger'

module TargetDossierPharmaApi
	class PharmaAPI < Grape::API
		prefix 'pharma' # prefix goes before version!!!!
#		version 'v1', :using => :path # host/td/api/v1...
#		format :json

		TIMEOUT = 2.5 # arbitrary timeout to ping endpoints
		RS_SIZE = 50 # number of results retrieved for any query


		before do
			header['Access-Control-Allow-Origin'] = '*'
			header['Access-Control-Request-Method'] = '*'
			header['Access-Control-Allow-Methods'] = 'POST, GET, OPTIONS, PUT, DELETE'
			header['Access-Control-Allow-Headers'] = 'api_key,content-type'

			@proxy = APIProxy.new
		end


		desc 'Gets information about the GO processes a target is involved in'
		params do
			requires :acc, :type => String, :regexp => /[A-Z][A-Z0-9]{5}/, :desc => 'Uniprot accession of the target'
		end
		get '/bio_process/target/:acc' do
			proxy = APIProxy.new
			process_obj = proxy.get_process4target(params[:acc])

			process_obj
		end



		desc 'Gets genes/targets involved in a biological process'
		params do
			optional :term, :type => String, :desc => 'A (process9)term for searching. It is optional as the query works anyway, but actually it will/should be set always'
		end
		get '/bio_process/process/:term' do
			proxy = APIProxy.new
			targets_obj = proxy.get_targets4process(params[:term])

			targets_obj
		end


		desc 'Gets the CHEMBLID from an Uniprot accession'
		params do
			requires :acc, :type => String, :regexp => /[A-Z][A-Z0-9]{5}/, :desc => 'Uniprot accession of the target'
		end
		get '/chembl/uniprot/:acc' do
			chembl_entry = @proxy.uniprot2chembl(params[:acc])
			chembl_entry

		end



		desc 'Gets information about the activities, assays and compounds involving the target'
		params do
			requires :acc, :type => String, :regexp => /[A-Z][A-Z0-9]{5}/, :desc => 'Uniprot accession of the target'
		end
		get '/:acc/bioactivities' do
			activities = @proxy.activities4target(params[:acc])
			activities
		end




		desc 'Gets OMIM information about a disease. Information retrieved from OMIM is related to its phenotypical traits and genes for it'
		params do
			requires :disease, :type => String, :desc => 'The disease, disorder or phenotypical trait to be search for'
			optional :start, :type => Integer, :desc => 'The offset of the result set'
			optional :limit, :type => Integer, :desc => 'The number of entries to be retrieved (default is 10)'
			optional :callback, :type => String, :desc => 'The callback for JSONP requests'
		end
		get '/disease/traits/:disease' do
			omim_data = @proxy.get_omim4disease(params[:disease], params[:start], params[:limit])
			omim_data
		end


		desc 'Gets a list of diseases from OMIM.'
		params do
			requires :disease, :type => String, :desc => 'A disease name'
			optional :offset, :type => Integer, :desc => 'The number of the first result to return of the whole list of results'
			optional :limit, :type => Integer, :desc => 'The max number of results to send back'
			optional :callback, :type => String, :desc => 'A callback function for JSONP requests'
		end
		get '/disease/lookup' do
			resp = @proxy.omim_disease_lookup(params[:disease], params[:start], params[:limit])

			resp
		end



		desc 'Gets genotype map (a list of genes found involved for a disease) from the OMIM number for the disease'
		params do
			requires :mim_number, :type => String, :desc => 'A OMIM number for a disease or trait'
			optional :callback, :type => String, :desc => 'A callback function for JSONP requests'
		end
		get '/disease/genemap' do
			resp = @proxy.omim_entry_info(params[:mim_number])

			resp
		end



		desc 'Gets a set of proteins involved in a disease'
		params do
			requires :disease, :type => String, :desc => 'A disease name'
			optional :offset, :type => Integer, :desc => 'The number of the first result to return of the whole list of results'
			optional :limit, :type => Integer, :desc => 'The max number of results to send back'
			optional :callback, :type => String, :desc => 'A callback function for JSONP requests'
		end
		get '/disease/targets' do
			resp = @proxy.get_targets4disease(params[:disease], params[:start], params[:limit])

			resp # should be a hash or nil
		end


		desc 'Gets a list of diseases a gene is involved in'
		params do
			requires :ident, :type => String, :desc => 'A gene symbol'
		end
		get '/gene/diseases' do
			resp = @proxy.swissvar_genes4disease(params[:ident])

			resp
		end



		desc 'Gets a list of diseases a protein is involved in'
		params do
			requires :accession, :type => String, :regexp => /[A-Z][A-Z0-9]{5}/, :desc => 'An Uniprot accession'
		end
		get '/target/diseases' do
			resp = @proxy.swissvar_genes4disease(params[:accession])

			resp
		end



		desc 'Gets a list of compounds based on a search term'
		params do
			requires :term, :type => String, :desc => 'A term to lookup for compounds'
			optional :offset, :type => Integer, :desc => 'The number of the first result to return of the whole list of results'
			optional :limit, :type => Integer, :desc => 'The max number of results to send back'
			optional :callback, :type => String, :desc => 'A callback function for JSONP requests'
		end
		get '/compound/lookup' do
			proxy = OpsWikiApiCall.new

			resp = proxy.search_by_tag('07a84994-e464-4bbf-812a-a4b96fa3d197', params[:term])

			resp
		end


		desc 'Gets info about a compound given its uuid/conceptWiki uri'
		params do
			requires :uri, :type => String, :desc => 'A conceptwiki uri for a compound. Can be got from a /pharma/compound/lookup.json?term request'
			optional :callback, :type => String, :desc => 'A callback function for JSONP requests'
		end
		get '/compound/info' do
			proxy = OpsApiCall.new

			resp = proxy.request('compoundInfo', {:uri => params[:uri]})
			resp
		end


		desc 'Gets activities for a compound out of its chemblId'
		params do
			requires :chembl_id, :type => String, :regexp => /CHEMBL\d+/, :desc => 'A Chembl id'
			optional :callback, :type => String, :desc => 'A callback function for JSONP requests'
		end
		get '/compound/activities/:chembl_id' do
			resp = @proxy.get_compound_activities(params[:chembl_id])

			resp
		end

	end # PharmaAPI class

end