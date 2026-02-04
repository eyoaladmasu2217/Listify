module Api
  module V2
    class SongsController < ApplicationController
      before_action :authenticate_user!

      # GET /api/v2/songs
      def index
        songs = Song.includes(:artist, :album).all
        render json: SongSerializer.render(songs), status: :ok
      end

      # GET /api/v2/songs/:id
      def show
        song = Song.find_by(id: params[:id])
        if song
          render json: SongSerializer.render(song), status: :ok
        else
          render json: { error: "Song not found" }, status: :not_found
        end
      end

      # POST /api/v2/songs/sync
      # Ingestion endpoint for admins/devs to fetch from Deezer
      def sync
        result = Music::DeezerSyncService.call(params[:query], limit: params[:limit], index: params[:index])
        if result.success?
          render json: SongSerializer.render(result.data), status: :ok
        else
          render json: { error: result.errors }, status: :unprocessable_entity
        end
      end
    end
  end
end
