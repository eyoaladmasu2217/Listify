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

      def search
        query = params[:q]
        return render json: { data: [] } if query.blank?

        response = Faraday.get("https://api.deezer.com/search", { q: query })
        
        if response.success?
          data = JSON.parse(response.body)
          # Log data for debugging if internal search fails
          Rails.logger.info "Deezer Search Result Count: #{data['data']&.count}"
          
          normalized_data = (data["data"] || []).map do |item|
            {
              id: 0,
              deezer_id: item["id"],
              title: item["title"],
              artist_name: item["artist"]["name"],
              album_title: item["album"]["title"],
              cover_url: item["album"]["cover_big"],
              preview_url: item["preview"],
              duration_ms: (item["duration"] || 0) * 1000
            }
          end
          render json: normalized_data
        else
          render json: { error: "Deezer API error" }, status: :bad_gateway
        end
      rescue StandardError => e
        Rails.logger.error "Search Error: #{e.message}"
        render json: { error: e.message }, status: :internal_server_error
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
