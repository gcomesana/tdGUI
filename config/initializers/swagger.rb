

require 'grape'
require 'grape-swagger'
require 'api/tdapi'
require 'api/grape-api'

module SwaggerGrapeMod
	class Root < Grape::API
		mount TargetDossierApi::TDApi
		# mount GrapeApi::TestApi

		add_swagger_documentation # :api_version => 1
	end
end