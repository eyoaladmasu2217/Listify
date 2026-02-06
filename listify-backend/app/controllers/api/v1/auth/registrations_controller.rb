module Api
  module V1
    module Auth
      class RegistrationsController < Devise::RegistrationsController
        skip_before_action :authenticate_request!, only: :create
        respond_to :json

        before_action :configure_sign_up_params, only: [ :create ]
        before_action :configure_account_update_params, only: [ :update ]

        def create
          build_resource(sign_up_params)

          resource.save
          yield resource if block_given?
          
          if resource.persisted?
            # Generate JWT token for auto-login
            token = JsonWebToken.encode(sub: resource.id, email: resource.email)
            
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

        private

        def configure_sign_up_params
          devise_parameter_sanitizer.permit(:sign_up, keys: %i[username bio profile_picture_url])
        end

        def configure_account_update_params
          devise_parameter_sanitizer.permit(:account_update, keys: %i[username bio profile_picture_url])
        end

        def sign_up_params
          params.require(:user).permit(:username, :email, :password, :bio, :profile_picture_url)
        end
      end
    end
  end
end
