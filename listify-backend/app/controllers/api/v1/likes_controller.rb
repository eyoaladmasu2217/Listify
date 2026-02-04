module Api
  module V1
    class LikesController < ApplicationController
      before_action :authenticate_user!

      # POST /api/v1/likes
      def create
        likeable = find_likeable
        return unless likeable

        result = Social::LikeService.call(current_user, likeable)

        if result.success?
          render json: result.data, status: :created
        else
          render json: { error: result.errors.to_sentence }, status: :unprocessable_entity
        end
      end

      # DELETE /api/v1/likes/:id
      def destroy
        like = current_user.likes.find(params[:id])
        like.destroy
        render json: { message: "Unliked successfully" }, status: :ok
      rescue ActiveRecord::RecordNotFound
        render json: { error: "Like not found or not authorized" }, status: :not_found
      end

      private

  # Whitelist of allowed likeable types to prevent unsafe reflection
  ALLOWED_LIKEABLE_TYPES = %w[Review Song].freeze

  def find_likeable
    # Validate the type against whitelist before using constantize
    type = params[:likeable_type]
    unless ALLOWED_LIKEABLE_TYPES.include?(type)
      render json: { error: "Invalid likeable type" }, status: :bad_request
      return nil
    end

    type.constantize.find(params[:likeable_id])
  rescue ActiveRecord::RecordNotFound
    render json: { error: "Target not found" }, status: :not_found
    nil
  end
    end
  end
end
