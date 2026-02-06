module Api
  module V1
    class UsersController < ApplicationController
      # Authentication is handled by ApplicationController's before_action :authenticate_request!
      # Remove the include Authenticable to avoid double authentication

      before_action :set_user, only: [:followers, :following]

      # GET /api/v1/users/me
      def me
        render json: { user: UserSerializer.render_as_hash(current_user, view: :simple) }, status: :ok
      end

      # GET /api/v1/users/:id/followers
      def followers
        render json: UserSerializer.render(@user.followers, view: :simple), status: :ok
      end

      # GET /api/v1/users/:id/following
      def following
        render json: UserSerializer.render(@user.following, view: :simple), status: :ok
      end

      # DELETE /api/v1/users/:id
      def destroy
        current_user.destroy
        render json: { message: "Account deleted successfully" }, status: :ok
      end

      private

      def set_user
        @user = User.find(params[:id])
      rescue ActiveRecord::RecordNotFound
        render json: { error: "User not found" }, status: :not_found
      end

      def user_params
        params.permit(:username, :bio, :profile_picture_url, :theme, :notifications_enabled, :is_private)
      end
    end
  end
end
