class TdguiProxyController < ApplicationController

	def test (myparam = params[:q]) # call is app.get '/tdgui_proxy/test?q=pffffffff'
		myparam = myparam ? myparam: "nillllllll"

		render :json => {'res' => "tdguiProxy Controller myparam #{myparam} ok"}.to_json, :layout => false

	end


	def multiple_entries_retrieval ()

#		entries = {:uniprotIds => ['Q13362','P12345','P0AEN3','P0AEN2','P0AEN1']}
		entries = {:uniprotIds => ['Q13362','P12345','P0AEN3']}
		tdgui_proxy = TdguiProxy.new
		hash_entries = tdgui_proxy.get_multiple_entries(entries)

		render :json => entries.to_json, :layout => false
	end

end
