class Content::CreateReviewService < BaseService
  def initialize(user, params)
    @user = user
    @params = params
    @song_data = params.delete(:song_data)
  end

  def call
    ActiveRecord::Base.transaction do
      song = find_or_create_song
      review = @user.reviews.build(@params.merge(song_id: song.id))

      if review.save
        create_activity(review)
        success(review)
      else
        failure(review.errors.full_messages)
      end
    end
  rescue StandardError => e
    failure(e.message)
  end

  private

  def find_or_create_song
    return Song.find(@params[:song_id]) if @params[:song_id].present? && @params[:song_id].to_i > 0
    return nil unless @song_data

    # Find or create album for metadata (especially cover_url)
    album = Album.find_or_create_by(title: @song_data[:album_title], artist_name: @song_data[:artist_name]) do |a|
      a.cover_url = @song_data[:cover_url]
    end if @song_data[:album_title]

    Song.find_or_create_by(deezer_id: @song_data[:deezer_id]) do |s|
      s.title = @song_data[:title]
      s.artist_name = @song_data[:artist_name]
      s.preview_url = @song_data[:preview_url]
      s.duration_ms = @song_data[:duration_ms]
      s.album = album if album
    end
  end

  def create_activity(review)
    Activity.create!(
      actor: @user,
      action_type: "reviewed",
      target: review
    )
  end
end
