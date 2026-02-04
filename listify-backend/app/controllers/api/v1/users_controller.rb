module Api
  module V1
    class UsersController < ApplicationController
      before_action :authenticate_user!

      before_action :set_user, only: [ :followers, :following ]

      def me
        render json: { user: UserSerializer.render_as_hash(current_user, view: :simple) }, status: :ok
      end

      # The follow/unfollow logic is now handled in FollowsController (V1)
      # and RelationshipsController (V2).

      def followers
        render json: UserSerializer.render(@user.followers, view: :simple), status: :ok
      end

      def following
        render json: UserSerializer.render(@user.following, view: :simple), status: :ok
      end

      private

      def set_user
        @user = User.find(params[:id])
      rescue ActiveRecord::RecordNotFound
        render json: { error: "User not found" }, status: :not_found
      end
    end
  end
end
