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
            # Increment search counts
            songs.each do |song|
              song.increment_search_count!
              song.album.increment_search_count! if song.album
            end
            Rails.logger.info "Found #{songs.count} songs from Deezer"
          else
            songs = Song.where("title LIKE ?", "%#{params[:q]}%")
                        .includes(:artist, :album)
          end
        else
          songs = Song.includes(:artist, :album)
                      .page(params[:page])
                      .per(params[:per] || 20)
        end
        
        render json: SongSerializer.render_as_json(songs), status: :ok
      end

      def trending
        songs = Song.trending.includes(:artist, :album).limit(20)
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
