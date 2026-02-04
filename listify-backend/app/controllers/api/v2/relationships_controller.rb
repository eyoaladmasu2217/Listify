module Api
  module V2
    class RelationshipsController < ApplicationController
      before_action :authenticate_user!

      # POST /api/v2/relationships
      def create
        result = Social::FollowUserService.call(current_user, params[:followed_id])

        if result.success?
          render json: { success: true, message: "Successfully followed" }, status: :created
        else
          render json: { error: result.errors.to_sentence }, status: :unprocessable_entity
        end
      end

      # DELETE /api/v2/relationships/:followed_id
      def destroy
        follow = current_user.active_follows.find_by(following_id: params[:id])

        if follow&.destroy
          render json: { success: true, message: "Successfully unfollowed" }, status: :ok
        else
          render json: { error: "Relationship not found" }, status: :not_found
        end
      end
    end
  end
end
