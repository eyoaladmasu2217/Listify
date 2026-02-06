module Api
  module V1
    class ReviewsController < ApplicationController
      before_action :authenticate_user!
      before_action :set_song, only: [ :index ]
      before_action :set_review, only: [ :update, :destroy ]
      
      # GET /api/v1/reviews/me
      def me
        reviews = current_user.reviews.includes(:song)
        render json: reviews, include: { song: { only: [ :id, :title, :artist_name, :cover_url ] } }, status: :ok
      end

      # POST /api/v1/reviews
      def create
        result = Content::CreateReviewService.call(current_user, review_params)
        if result.success?
          render json: result.data, status: :created
        else
          render json: { error: result.errors.to_sentence }, status: :unprocessable_entity
        end
      end

      # GET /api/v1/songs/:song_id/reviews
      def index
        reviews = @song.reviews.includes(:user)
        render json: reviews, include: { user: { only: [ :id, :username, :profile_picture_url ] } }, status: :ok
      end

      # PUT /api/v1/reviews/:id
      def update
        if @review.user_id == current_user.id
          if @review.update(review_params)
            render json: @review, status: :ok
          else
            render json: { error: @review.errors.full_messages.to_sentence }, status: :unprocessable_entity
          end
        else
          render json: { error: "You are not authorized to edit this review" }, status: :forbidden
        end
      end

      # DELETE /api/v1/reviews/:id
      def destroy
        if @review.user_id == current_user.id
          @review.destroy
          render json: { message: "Review deleted successfully" }, status: :ok
        else
          render json: { error: "You are not authorized to delete this review" }, status: :forbidden
        end
      end

      private

      def set_song
        @song = Song.find(params[:song_id])
      rescue ActiveRecord::RecordNotFound
        render json: { error: "Song not found" }, status: :not_found
      end

      def set_review
        @review = Review.find(params[:id])
      rescue ActiveRecord::RecordNotFound
        render json: { error: "Review not found" }, status: :not_found
      end

      def review_params
        params.require(:review).permit(
          :song_id, :rating, :review_text,
          song_data: [ :deezer_id, :title, :artist_name, :album_title, :cover_url, :preview_url, :duration_ms ]
        )
      end
    end
  end
end
