module Api
  module V1
    class FollowsController < ApplicationController
      before_action :authenticate_user!
      before_action :set_target_user

      # POST /api/v1/users/:user_id/follow
      def create
        Rails.logger.info "DEBUG: Attempting to follow user #{@target_user.id} by #{current_user.id}"
        result = Social::FollowUserService.call(current_user, @target_user.id)

        if result.success?
          render json: { success: true, message: "Now following user #{@target_user.id}" }, status: :ok
        else
          Rails.logger.error "DEBUG: Follow failed: #{result.errors.inspect}"
          render json: { error: result.errors.to_sentence }, status: :unprocessable_entity
        end
      end

      # DELETE /api/v1/users/:user_id/follow
      def destroy
        Rails.logger.info "DEBUG: Attempting to unfollow user #{@target_user.id} by #{current_user.id}"
        follow = current_user.active_follows.find_by(following_id: @target_user.id)

        if follow
          if follow.destroy
             render json: { success: true, message: "Unfollowed user #{@target_user.id}" }, status: :ok
          else
             render json: { error: follow.errors.full_messages.to_sentence }, status: :unprocessable_entity
          end
        else
          Rails.logger.warn "DEBUG: Unfollow failed - relationship not found"
          render json: { error: "You are not following this user" }, status: :unprocessable_entity
        end
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
