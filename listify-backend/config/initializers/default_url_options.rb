# Set default host for URL helpers (used by ActiveStorage rails_blob_url in models/serializers)
host = ENV.fetch("DEFAULT_URL_HOST", "localhost:3000")
Rails.application.routes.default_url_options[:host] ||= host
Rails.application.config.action_mailer.default_url_options ||= { host: host }
