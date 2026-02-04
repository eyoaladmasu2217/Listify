module Api
  module V1
    class CommentsController < ApplicationController
      before_action :authenticate_user!
      before_action :set_review, only: [ :index ]

      # POST /api/v1/comments
      def create
        commentable = find_commentable
        return unless commentable

        result = Content::CreateCommentService.call(current_user, commentable, params[:text])

        if result.success?
          render json: result.data, status: :created
        else
          render json: { error: result.errors.to_sentence }, status: :unprocessable_entity
        end
      end

      # GET /api/v1/reviews/:review_id/comments
      def index
        comments = @review.comments.includes(:user).order(created_at: :desc)
        render json: comments, include: { user: { only: [ :id, :username, :profile_picture_url ] } }, status: :ok
      end

      private

  # Whitelist of allowed commentable types to prevent unsafe reflection
  ALLOWED_COMMENTABLE_TYPES = %w[Review].freeze

  def find_commentable
    # Validate the type against whitelist before using constantize
    type = params[:commentable_type]
    unless ALLOWED_COMMENTABLE_TYPES.include?(type)
      render json: { error: "Invalid commentable type" }, status: :bad_request
      return nil
    end

    type.constantize.find(params[:commentable_id])
  rescue ActiveRecord::RecordNotFound
    render json: { error: "Target not found" }, status: :not_found
    nil
  end

      def set_review
        @review = Review.find(params[:review_id])
      rescue ActiveRecord::RecordNotFound
        render json: { error: "Review not found" }, status: :not_found
      end
    end
  end
end
