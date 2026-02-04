# config/initializers/rack_attack.rb
# Rack::Attack configuration for rate limiting and throttling

class Rack::Attack
  # Configure cache store (using Rails.cache by default)
  Rack::Attack.cache.store = ActiveSupport::Cache::MemoryStore.new

  ### Throttle Configuration ###

  # Throttle login attempts by IP address
  # Limit to 5 login attempts per 20 seconds per IP
  throttle("logins/ip", limit: 5, period: 20.seconds) do |req|
    if req.path == "/api/v2/users/sign_in" && req.post?
      req.ip
    end
  end

  # Throttle login attempts by email
  # Limit to 5 login attempts per 20 seconds per email
  throttle("logins/email", limit: 5, period: 20.seconds) do |req|
    if req.path == "/api/v2/users/sign_in" && req.post?
      req.params["email"].to_s.downcase.gsub(/\s+/, "").presence
    end
  end

  # Throttle API requests by IP address
  # Limit to 300 requests per 5 minutes per IP for authenticated endpoints
  throttle("api/ip", limit: 300, period: 5.minutes) do |req|
    if req.path.start_with?("/api/")
      req.ip
    end
  end

  # Throttle Deezer sync endpoint more strictly
  # Limit to 10 sync requests per minute per IP
  throttle("deezer_sync/ip", limit: 10, period: 1.minute) do |req|
    if req.path == "/api/v2/songs/sync" && req.post?
      req.ip
    end
  end

  ### Custom Response ###

  # Customize the response for throttled requests
  self.throttled_responder = lambda do |env|
    retry_after = env["rack.attack.match_data"][:period]
    [
      429,
      {
        "Content-Type" => "application/json",
        "Retry-After" => retry_after.to_s
      },
      [ { error: "Rate limit exceeded. Please try again later." }.to_json ]
    ]
  end

  ### Blocklist & Safelist ###

  # Always allow requests from localhost in development
  safelist("allow-localhost") do |req|
    req.ip == "127.0.0.1" || req.ip == "::1" if Rails.env.development?
  end

  # Block suspicious requests (optional - uncomment to enable)
  # blocklist('block-suspicious-ips') do |req|
  #   # Block IPs that are in your blocklist
  #   # BlockedIp.where(ip: req.ip).exists?
  # end

  ### Logging ###

  # Log blocked requests
  ActiveSupport::Notifications.subscribe("rack.attack") do |name, start, finish, request_id, payload|
    req = payload[:request]
    if [ :throttle, :blocklist ].include?(payload[:match_type])
      Rails.logger.warn "[Rack::Attack] #{payload[:match_type]} #{req.ip} #{req.request_method} #{req.fullpath}"
    end
  end
end
