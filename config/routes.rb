require 'grape'

TdGUI::Application.routes.draw do

	get "home/index", :as => :home

	if Rails.env.development?
		match 'test' => 'home#test'
	end
#  get "home/test"

=begin
  get "thrashcan/start"
  get "thrashcan/run"
  get "thrashcan/test"

  get "thrashcan/ping_json/:inParam"  => "thrashcan#ping_json"
  get "thrashcan/ping/:query"  => "thrashcan#ping"
=end

# Below not working without the part after => (which is the :controllers)
#  get "thrashcan/ping_json/:inParam" # => "thrashcan#ping_json"


  resources :thrashcan do
    collection do
      get :ping
      get 'ping_json'
      get 'test'
    end
  end


	resources :tdgui_proxy do
		collection do
			get :test
			get :multiple_entries_retrieval
			get :interactions_retrieval
			get :get_uniprot_by_name
			get :get_uniprot_by_acc

			get :get_pharm_count
			get :get_pharm_by_target_page
			post :send_feedback
		end
	end


  resources :concept_wiki_api_calls do
    collection do
      get :protein_lookup
      get :compound_lookup
			get :test
    end
	end


	resources :core_api_calls do
		collection do
			get :protein_info
#			get :protein_lookup
			get :pharm_by_protein_name
			get :wiki_pathway_protein_lookup
			get :wiki_pathways_by_protein

			get :test
			get :check
		end
	end


	resources :feedback do
		collection do
			post :feedback
		end
	end

=begin
    resources :thrashcan do
      collection do
        get :ping
        get :ping_json
        get :test
#        get :concept_name_lookup
      end
    end
=end
  root :to => "home#index"

	# mount GrapeApi::TestApi => "/td" # should be /grape/test-grape/api[/thisisonlyatest]

#	match "home" => "home#index"


  # The priority is based upon order of creation:
  # first created -> highest priority.

  # Sample of regular route:
  #   match 'products/:id' => 'catalog#view'
  # Keep in mind you can assign values other than :controllers and :action

  # Sample of named route:
  #   match 'products/:id/purchase' => 'catalog#purchase', :as => :purchase
  # This route can be invoked with purchase_url(:id => product.id)

  # Sample resource route (maps HTTP verbs to controllers actions automatically):
  #   resources :products

  # Sample resource route with options:
  #   resources :products do
  #     member do
  #       get 'short'
  #       post 'toggle'
  #     end
  #
  #     collection do
  #       get 'sold'
  #     end
  #   end

  # Sample resource route with sub-resources:
  #   resources :products do
  #     resources :comments, :sales
  #     resource :seller
  #   end

  # Sample resource route with more complex sub-resources
  #   resources :products do
  #     resources :comments
  #     resources :sales do
  #       get 'recent', :on => :collection
  #     end
  #   end

  # Sample resource route within a namespace:
  #   namespace :admin do
  #     # Directs /admin/products/* to Admin::ProductsController
  #     # (app/controllers/admin/products_controller.rb)
  #     resources :products
  #   end

  # You can have the root of your site routed with "root"
  # just remember to delete public/index.html.old.
  # root :to => 'welcome#index'

  # See how all your routes lay out with "rake routes"

  # This is a legacy wild controllers route that's not recommended for RESTful applications.
  # Note: This route will make all actions in every controllers accessible via GET requests.
  # match ':controllers(/:action(/:id(.:format)))'

#  match ':thrashcan/:ping' => 'thrashcan#ping'


end
