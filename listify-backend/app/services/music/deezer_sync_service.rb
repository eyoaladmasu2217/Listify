require "faraday"
require "json"

class Music::DeezerSyncService < BaseService
  BASE_URL = "https://api.deezer.com"

  # Accept query and optional params for pagination: limit, index
  def initialize(query, opts = {})
    @query = query
    @limit = opts[:limit]
    @index = opts[:index]
  end

  def call
    data = fetch_from_deezer
    return failure("No data found from Deezer") if data["data"].nil? || data["data"].empty?

    processed_items = data["data"].map { |item| process_track(item) }
    success(processed_items)
  rescue StandardError => e
    failure(e.message)
  end

  private

  def connection
    @connection ||= Faraday.new(url: BASE_URL) do |f|
      f.adapter Faraday.default_adapter
    end
  end

  def fetch_from_deezer
    params = { q: @query }
    params[:limit] = @limit if @limit.present?
    params[:index] = @index if @index.present?

    attempts = 0
    begin
      loop do
        attempts += 1
        resp = connection.get "/search", params

        if resp.status == 429
          retry_after = resp.headers["retry-after"]
          sleep_time = retry_after ? retry_after.to_i : (0.5 * attempts)

          if attempts >= 3
            raise "Deezer rate limited (status 429). Retry-After: #{retry_after || 'unknown'}"
          end

          sleep sleep_time
          next
        end

        unless resp.success?
          raise "Deezer API returned status #{resp.status}"
        end

        return JSON.parse(resp.body)
      end
    rescue Faraday::ConnectionFailed => e
      raise "Deezer connection failed: #{e.message}"
    end
  end

  def process_track(track_data)
    ActiveRecord::Base.transaction do
      # Sync Artist
      artist_id = track_data.dig("artist", "id")
      artist_name = track_data.dig("artist", "name")

      raise "Missing artist name in Deezer payload" if artist_name.blank?

      artist = Artist.find_or_initialize_by(deezer_id: artist_id)
      artist.name = artist_name # Always set name from payload
      artist.save!

      # Sync Album
      album_id = track_data.dig("album", "id")
      album_title = track_data.dig("album", "title")
      album_cover = track_data.dig("album", "cover_medium")
      album = Album.find_or_initialize_by(deezer_id: album_id)
      album.title = album_title if album.title.blank? && album_title.present?
      album.cover_url = album_cover if album.cover_url.blank? && album_cover.present?
      album.artist = artist if album.artist.nil?
      album.artist_name = artist.name if album.artist_name.blank?
      album.save!

      # Sync Song
      song_deezer_id = track_data["id"]
      song = Song.find_or_initialize_by(deezer_id: song_deezer_id)
      song.title = track_data["title"] if song.title.blank? && track_data["title"].present?
      song.artist_name = artist.name if song.artist_name.blank?
      song.duration_ms = track_data["duration"].present? ? track_data["duration"] * 1000 : song.duration_ms
      song.preview_url = track_data["preview"] if track_data["preview"].present?
      song.album = album
      song.artist = artist
      song.save!

      song
    end
  end
end
