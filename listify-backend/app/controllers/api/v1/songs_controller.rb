module Api
  module V1
    class SongsController < ApplicationController
      # Removed authenticate_user! as it conflicts with the custom authenticate_request! in ApplicationController

      def index
        Rails.logger.error "SONGS INDEX PARAMS: #{params.to_unsafe_h.inspect}"
        if params[:q].present?
          Rails.logger.error "Searching for: #{params[:q]}"
          result = Music::DeezerSyncService.call(params[:q], limit: 20)
          
          if result.success?
            songs = result.data
            Rails.logger.info "Found #{songs.count} songs from Deezer"
          else
            Rails.logger.warn "Deezer search failed: #{result.errors}"
            # Fallback to local search if Deezer fails
            songs = Song.where("title LIKE ?", "%#{params[:q]}%")
                        .includes(:artist, :album)
            Rails.logger.info "Fallback found #{songs.count} local songs"
          end
        else
          songs = Song.includes(:artist, :album)
                      .page(params[:page])
                      .per(params[:per] || 20)
        end
        
        render json: SongSerializer.render_as_json(songs), status: :ok
      end

      def show
        song = Song.find(params[:id])
        render json: SongSerializer.render_as_json(song), status: :ok
      rescue ActiveRecord::RecordNotFound
        render json: { error: "Song not found" }, status: :not_found
      end
    end
  end
end
