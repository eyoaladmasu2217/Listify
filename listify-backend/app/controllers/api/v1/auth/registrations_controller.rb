module Api
  module V1
    module Auth
      class RegistrationsController < Devise::RegistrationsController
        respond_to :json

        before_action :configure_sign_up_params, only: [ :create ]
        before_action :configure_account_update_params, only: [ :update ]

        def sign_up(resource_name, resource)
          sign_in(resource_name, resource, store: false)
        end

        private

        def respond_with(resource, _opts = {})
          if resource.persisted?
            token = request.env['warden-jwt_auth.token']
            render json: {
              status: { code: 201, message: "Signed up successfully." },
              access_token: token,
              user: {
                id: resource.id,
                username: resource.username,
                email: resource.email,
                bio: resource.bio,
                profile_picture_url: resource.profile_picture_url
              }
            }, status: :created
          else
            render json: {
              status: { message: "User could not be created successfully. #{resource.errors.full_messages.to_sentence}" }
            }, status: :unprocessable_entity
          end
        end

        def configure_sign_up_params
          devise_parameter_sanitizer.permit(:sign_up, keys: %i[username bio profile_picture_url])
        end

        def configure_account_update_params
          devise_parameter_sanitizer.permit(:account_update, keys: %i[username bio profile_picture_url])
        end
      end
    end
  end
end
