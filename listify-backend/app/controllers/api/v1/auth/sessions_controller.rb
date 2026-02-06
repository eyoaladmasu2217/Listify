# app/controllers/api/v1/auth/sessions_controller.rb
module Api
  module V1
    module Auth
      class SessionsController < Devise::SessionsController
        skip_before_action :verify_signed_out_user, only: :destroy
        skip_before_action :authenticate_request!, only: :create
        respond_to :json

        def create
          # Support both nested params (user: { email, password }) and flat params
          email = params.dig(:user, :email) || params[:email]
          password = params.dig(:user, :password) || params[:password]
          
          Rails.logger.debug "Login attempt for email: #{email}"
          
          user = User.find_by(email: email.downcase)
          
          if user&.valid_password?(password)
            token = JsonWebToken.encode(sub: user.id, email: user.email)
            Rails.logger.info "Login successful for user: #{user.email}"
            
            render json: { 
              access_token: token, 
              user: UserSerializer.render_as_hash(user, view: :simple) 
            }, status: :ok
          else
            Rails.logger.warn "Login failed for email: #{email}"
            render json: { error: "Invalid email or password" }, status: :unauthorized
          end
        end

        def destroy
          # No session needed for JWT
          Rails.logger.info "User logged out"
          render json: { message: "Logged out successfully" }, status: :ok
        end
      end
    end
  end
end
