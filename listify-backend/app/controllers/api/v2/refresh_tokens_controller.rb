module Api
  module V2
    class RefreshTokensController < ApplicationController
      def create
        refresh_token = RefreshToken.find_by(token: params[:refresh_token])

        if refresh_token&.active?
          user = refresh_token.user

          # Rotate token: revoke old one, create new one
          refresh_token.revoke!
          new_refresh_token = user.refresh_tokens.create!

          # Generate new JWT manually since this is a custom rotation flow
          token, payload = Warden::JWTAuth::UserEncoder.new.call(user, :user, nil)

          render json: {
            access_token: token,
            refresh_token: new_refresh_token.token,
            expires_in: payload["exp"] - payload["iat"],
            jwt_version: user.jwt_version
          }, status: :ok
        else
          render json: { error: "Invalid or expired refresh token" }, status: :unauthorized
        end
      end
    end
  end
end
