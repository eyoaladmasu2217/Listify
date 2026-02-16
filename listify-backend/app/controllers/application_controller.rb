# app/controllers/application_controller.rb
class ApplicationController < ActionController::API
  include ActionController::MimeResponds
  respond_to :json

  # Devise parameter sanitization
  before_action :configure_permitted_parameters, if: :devise_controller?

  # JWT authentication for API requests
  before_action :authenticate_request!

  # Global Error Handling
  rescue_from ActiveRecord::RecordNotFound, with: :not_found
  rescue_from ActionController::ParameterMissing, with: :bad_request

  private

  def not_found(exception)
    render json: { error: exception.message }, status: :not_found
  end

  def bad_request(exception)
    render json: { error: exception.message }, status: :bad_request
  end

  # This method checks the Authorization header for a JWT token
  def authenticate_request!
    header = request.headers['Authorization']
    
    Rails.logger.debug "=== AUTH DEBUG ==="
    Rails.logger.debug "Header: #{header}"
    
    if header.present?
      token = header.split(' ').last
      Rails.logger.debug "Token: #{token&.slice(0, 50)}..." # Log first 50 chars
      
      begin
        decoded = JsonWebToken.decode(token)
        
        unless decoded
          Rails.logger.warn "JWT decode returned nil - invalid or expired token"
          return render json: { error: 'Invalid or expired token' }, status: :unauthorized
        end
        
        Rails.logger.debug "Decoded: #{decoded}"
        
        @current_user = User.find_by(id: decoded[:sub])
        
        unless @current_user
          Rails.logger.warn "User not found for subject: #{decoded[:sub]}"
          return render json: { error: 'User not found' }, status: :unauthorized
        end
        
        Rails.logger.info "Authenticated user: #{@current_user.email}"
      rescue ActiveRecord::RecordNotFound => e
        Rails.logger.error "User not found: #{e.message}"
        render json: { error: 'User not found' }, status: :unauthorized
      rescue JWT::DecodeError => e
        Rails.logger.error "JWT Decode Error: #{e.message}"
        render json: { error: 'Invalid token' }, status: :unauthorized
      rescue => e
        Rails.logger.error "Unexpected auth error: #{e.class} - #{e.message}"
        render json: { error: 'Authentication failed' }, status: :unauthorized
      end
    else
      Rails.logger.warn "Missing Authorization header"
      render json: { error: 'Missing token' }, status: :unauthorized
    end
  end

  # Helper to access current user in controllers
  def current_user
    @current_user
  end

  protected

  def configure_permitted_parameters
    devise_parameter_sanitizer.permit(:sign_up, keys: [:username])
    devise_parameter_sanitizer.permit(:account_update, keys: [:username])
  end
end
