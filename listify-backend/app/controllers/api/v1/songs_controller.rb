module Api
  module V1
    class SongsController < ApplicationController
      before_action :authenticate_user!

      def index
        if params[:q].present?
          result = Music::DeezerSyncService.call(params[:q], limit: 20)
          if result.success?
            songs = result.data
          else
            # Fallback to local search if Deezer fails
            songs = Song.where("title LIKE ?", "%#{params[:q]}%")
                        .includes(:artist, :album)
          end
        else
          songs = Song.includes(:artist, :album)
                      .page(params[:page])
                      .per(params[:per] || 20)
        end
        
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
