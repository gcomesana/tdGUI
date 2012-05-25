
TdGUI::Application.routes.draw do

  get "home/index"
  get "home/test"

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



  resources :concept_wiki_api_calls do
    collection do
      get :protein_lookup
      get :compound_lookup
			get :test
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

# TODO Montar la caja de texto para atacar el proteinLookup
# TODO implica poner primero los controladores y hacer tests!!!!!


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
