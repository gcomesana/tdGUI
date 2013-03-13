module Middleware
  class AccessControlAllowAllOrigin

    def initialize(app)
      @app = app
    end

    def call(env)
			# puts "Middleware.call...\n" not called with OPTIONS request
      status, headers, body = @app.call(env)
      allow_all_origin!(headers)
      [status, headers, body]
    end

    private

    def allow_all_origin!(headers)
      headers['Access-Control-Allow-Origin'] = '*'
      headers['Access-Control-Request-Method'] = 'POST, GET, OPTIONS , PUT'
			headers['Access-Control-Allow-Headers'] = 'Origin, X-Atmosphere-tracking-id, X-Atmosphere-Framework, X-Cache-Date, Content-Type, X-Atmosphere-Transport, *'
    end

  end
end