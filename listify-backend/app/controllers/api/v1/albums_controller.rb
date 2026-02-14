module Api
  module V1
    class AlbumsController < ApplicationController
      def index
        albums = Album.includes(:artist).page(params[:page]).per(params[:per] || 20)
        render json: AlbumSerializer.render_as_json(albums), status: :ok
      end

      def trending
        # Ordered by trending_score (weighted likes, comments, reviews, searches)
        albums = Album.trending.includes(:artist).limit(20)
        render json: AlbumSerializer.render_as_json(albums), status: :ok
      end

      def show
        album = Album.find(params[:id])
        render json: AlbumSerializer.render_as_json(album), status: :ok
      rescue ActiveRecord::RecordNotFound
        render json: { error: "Album not found" }, status: :not_found
      end
    end
  end
end
