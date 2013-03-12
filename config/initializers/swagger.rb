

require 'grape'
require 'grape-swagger'
require 'api/tdapi'
require 'api/tdapi_pharma'
require 'api/grape-api'

module SwaggerGrapeMod
	class Root < Grape::API
		mount TargetDossierApi::TDApi
		mount GrapeApi::TestApi
		mount TargetDossierPharmaApi::PharmaAPI

		add_swagger_documentation :base_path => 'http://localhost:3003' # :api_version => 1
	end
end