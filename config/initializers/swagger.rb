

require 'grape'
require 'grape-swagger'
require "#{Rails.root}/app/api/tdapi"
# require 'api/tdapi'
require "#{Rails.root}/app/api/tdapi_pharma"
require "#{Rails.root}/app/api/grape-api"

module SwaggerGrapeAPI
	class Root < Grape::API
		mount TargetDossierApi::TDApi
#		mount GrapeApi::TestApi 
		mount TargetDossierPharmaApi::PharmaAPI

		# add_swagger_documentation :base_path => 'http://lady-qu.cnio.es:3003', :hide_documentation_path => true # :api_version => 1
		add_swagger_documentation :base_path => 'http://lady-qu.cnio.es:3003', :hide_documentation_path => true # :api_version => 1
	end
end
	