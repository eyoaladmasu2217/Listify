module Api
  module V1
    module Auth
      class SessionsController < Devise::SessionsController
        respond_to :json

        private

        def respond_with(resource, _opts = {})
          refresh_token = resource.refresh_tokens.create!
          token = request.env['warden-jwt_auth.token']

          render json: {
            user: UserSerializer.render_as_hash(resource, view: :simple),
            access_token: token,
            refresh_token: refresh_token.token,
            jwt_version: resource.jwt_version
          }, status: :ok
        end

        def respond_to_on_destroy
          head :no_content
        end
      end
    end
  end
end
