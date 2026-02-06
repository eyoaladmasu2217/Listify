# app/lib/json_web_token.rb
class JsonWebToken
  # Use the same secret as configured in devise.rb for JWT authentication
  SECRET_KEY = ENV["DEVISE_JWT_SECRET_KEY"] || 
               Rails.application.credentials.devise_jwt_secret_key ||
               Rails.application.secret_key_base

  def self.encode(payload, exp = 24.hours.from_now)
    payload[:exp] = exp.to_i
    JWT.encode(payload, SECRET_KEY, 'HS256')
  end

  def self.decode(token)
    # Handle nil or empty token
    return nil if token.nil? || token.to_s.empty?

    decoded = JWT.decode(token.to_s, SECRET_KEY, true, { algorithm: 'HS256' })[0]
    HashWithIndifferentAccess.new(decoded)
  rescue JWT::ExpiredSignature
    Rails.logger.warn "JWT decode error: Token has expired"
    nil
  rescue JWT::DecodeError => e
    Rails.logger.warn "JWT decode error: #{e.message}"
    nil
  rescue => e
    Rails.logger.error "JWT unexpected error: #{e.class} - #{e.message}"
    nil
  end
end
