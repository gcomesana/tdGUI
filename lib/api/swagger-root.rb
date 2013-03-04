
require 'grape-swagger'

=begin
module SwaggerGrapeMod
	class Root < Grape::API
		mount TargetDossierApi::TDApi

		add_swagger_documentation # :api_version => 1
	end
end
=end