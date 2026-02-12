module Api
  module V1
    class FollowsController < ApplicationController
      before_action :authenticate_user!
      before_action :set_target_user

      # POST /api/v1/users/:user_id/follow
      def create
        result = Social::FollowUserService.call(current_user, @target_user.id)

        if result.success?
          render json: { success: true, message: "Now following user #{@target_user.id}" }, status: :ok
        else
          render json: { error: result.errors.to_sentence }, status: :unprocessable_entity
        end
      end

      # DELETE /api/v1/users/:user_id/follow
      def destroy
        follow = current_user.active_follows.find_by(following_id: @target_user.id)

        if follow&.destroy
          render json: { success: true, message: "Unfollowed user #{@target_user.id}" }, status: :ok
        else
          render json: { error: "You are not following this user" }, status: :unprocessable_entity
        end
      end

      # GET /api/v1/users/:user_id/follow/status
      def status
        is_following = current_user.active_follows.exists?(following_id: @target_user.id)
        
        render json: { 
          is_following: is_following,
          user_id: @target_user.id 
        }, status: :ok
      end

      private

      def set_target_user
        @target_user = User.find(params[:user_id])
      rescue ActiveRecord::RecordNotFound
        render json: { error: "User not found" }, status: :not_found
      end
    end
  end
end
