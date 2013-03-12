
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
			optional :limit, :type => Integer, :desc => 'The number of entries to be retrieved (default is 10)'
		end
		get '/disease/traits/:disease' do
			omim_data = @proxy.get_omim4disease(params[:disease], params[:limit])
		end

	end # PharmaAPI class

end