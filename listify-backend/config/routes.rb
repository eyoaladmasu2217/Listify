Rails.application.routes.draw do
  # Standardizing the Devise routes for API use.
  devise_for :users,
             path: "api/v1/auth",
             path_names: { sign_in: "login", sign_out: "logout" },
             controllers: {
               sessions: "api/v1/auth/sessions",
               registrations: "api/v1/auth/registrations",
               passwords: "api/v1/auth/passwords"
             }

  namespace :api do
    namespace :v1 do
      resources :notifications, only: [ :index ] do
        member do
          patch :read
        end
      end

      get "users/me", to: "users#me"

      resources :users, only: [ :show, :index, :update ] do
        resource :follow, only: [ :create, :destroy ]
        member do
          get :followers
          get :following
        end
      end

      resources :songs, only: [ :index, :show ] do
        resources :reviews, only: [ :index ]
      end

      resources :reviews, only: [ :create, :update, :destroy ] do
        collection do
          get :me
        end
        member do
          post :like
        end
        resources :comments, only: [ :create ], module: :reviews
      end

      # Legacy likes/comments support if needed, but standardizing on nested resources
      resources :likes, only: [ :create, :destroy ]
      resources :comments, only: [ :create ]

      resources :collections, only: [ :create, :show, :index, :update, :destroy ] do
        member do
          post "items", to: "collections#add_item"
          delete "items/:song_id", to: "collections#remove_item"
        end
      end

      namespace :feed do
        get :following
        get :explore
      end
    end

    namespace :v2 do
      resources :relationships, only: [ :create, :destroy ]
      resources :refresh_tokens, only: [ :create ]
      resources :songs, only: [ :index, :show ] do
        collection do
          post :sync
        end
      end
      namespace :feed do
        get :following
        get :explore
      end
    end
  end

  get "up" => "rails/health#show", as: :rails_health_check
end
