module Api
  module V1
    class SongsController < ApplicationController
      before_action :authenticate_user!

      def index
        songs = Song.includes(:artist, :album)
                    .page(params[:page])
                    .per(params[:per] || 20)
        render json: SongSerializer.render(songs), status: :ok
      end

      def show
        song = Song.find(params[:id])
        render json: SongSerializer.render(song), status: :ok
      rescue ActiveRecord::RecordNotFound
        render json: { error: "Song not found" }, status: :not_found
      end
    end
  end
end
