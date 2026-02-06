# app/controllers/concerns/authenticable.rb
module Authenticable
  extend ActiveSupport::Concern

  included do
    before_action :authenticate_user!
  end

  def authenticate_user!
    header = request.headers['Authorization']
    
    # Handle missing header
    unless header.present?
      return render json: { error: 'Missing token' }, status: :unauthorized
    end
    
    token = header.split(' ').last
    
    # Handle nil token after split
    unless token.present?
      return render json: { error: 'Invalid token format' }, status: :unauthorized
    end
    
    decoded = JsonWebToken.decode(token)
    
    # Handle decode failure
    unless decoded
      return render json: { error: 'Invalid or expired token' }, status: :unauthorized
    end
    
    user = User.find_by(id: decoded[:sub])
    
    if user
      @current_user = user
    else
      render json: { error: 'User not found' }, status: :unauthorized
    end
  end

  def current_user
    @current_user
  end
end
