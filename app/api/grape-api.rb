

module GrapeApi
	class TestApi < Grape::API
		prefix 'grape' # prefix goes before version!!!!
#		version 'v1', :using => :path # host/td/api/v1...
#		format :json

=begin
		before do
			header['Access-Control-Allow-Origin'] = '*'
			header['Access-Control-Allow-Methods'] = 'OPTIONS, GET, POST, DELETE, PUT'
			header['Access-Control-Allow-Headers'] = 'Content-Type, api_key, Authorization'
			# header['Content-Type'] = 'application/json; charset=utf-8'
			header['Access-Control-Request-Method'] = '*'


			# header['Allow'] = 'OPTIONS,GET,HEAD'
		end
=end
		resource 'test-grape' do # host/grape/[v1]/api/test-grape[/something]
			desc 'Just a test with no params'
			get do
				{:res => 'this is only a test'}
			end

			desc 'This is another test supporting a only param with no path'
			params do
				requires :string_param, type: String, desc: 'A string param to see if it is got and documented'
			end
			get ':string_param' do
				{:res => "this is only a reverse test: #{params[:string_param]}"}
			end

		end


		resource 'path' do # /grape/api/v1/path/<something>

			desc 'Describe a path or so and needs a param', {
				:notes => 'Some implementation notes'
			}
			params do
				requires :where, type: String, desc: "A string where..."
			end
			get ':where' do
				{:path => "This is where: #{params[:where]}"}
			end


			desc 'Lets try query params...' # /grape/api/path/querystring/134?letter=2
			params do
				requires :number, type: Integer, desc: 'A mandatory integer param'
				optional :letter, type: String, desc: 'An optional string param'
			end

			get '/querystring/:number' do
				{:thenumber => params[:number], :thechar => params[:letter]}
			end
		end



		resource 'parameters' do # /grape/api/v1/def...

			params do
				optional :param_test, type: String, desc: 'An optional parameter...'
			end
			get '/test' do # /grape/api/[v1]/parameters/test[?param_test=<something>]
				proxy = TdguiProxy.new

				proxy.test(params[:param_test])
			end

		end

	end
end