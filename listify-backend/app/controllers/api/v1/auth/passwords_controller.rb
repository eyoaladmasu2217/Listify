module Api
  module V1
    module Auth
      class PasswordsController < Devise::PasswordsController
        respond_to :json

        # POST /api/v1/auth/password
        def create
          self.resource = resource_class.send_reset_password_instructions(resource_params)
          yield resource if block_given?

          if successfully_sent?(resource)
            render json: { message: "Reset password instructions sent to your email." }, status: :ok
          else
            render json: { error: resource.errors.full_messages.to_sentence }, status: :unprocessable_entity
          end
        end

        # PUT/PATCH /api/v1/auth/password
        def update
          self.resource = resource_class.reset_password_by_token(resource_params)
          yield resource if block_given?

          if resource.errors.empty?
            resource.unlock_access! if unlockable?(resource)
            if Devise.sign_in_after_reset_password
              resource.after_database_authentication
              sign_in(resource_name, resource, store: false)
            end
            render json: { message: "Password updated successfully." }, status: :ok
          else
            render json: { error: resource.errors.full_messages.to_sentence }, status: :unprocessable_entity
          end
        end
      end
    end
  end
end
