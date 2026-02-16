class Social::LikeService < BaseService
  def initialize(user, likeable)
    @user = user
    @likeable = likeable
  end

  def call
    ActiveRecord::Base.transaction do
      like = Like.find_or_initialize_by(user: @user, likeable: @likeable)
      return failure("Already liked") unless like.new_record?

      if like.save
        trigger_post_like_actions(like)
        success(like)
      else
        failure(like.errors.full_messages)
      end
    end
  rescue StandardError => e
    failure(e.message)
  end

  private

  def trigger_post_like_actions(like)
    create_activity(like)
    create_notification(like)
    update_trending_stats
  end

  def create_activity(like)
    Activity.create!(
      actor: @user,
      action_type: "liked",
      target: @likeable
    )
  end

  def create_notification(like)
    # Notify the owner of the object being liked
    return unless @likeable.respond_to?(:user) && @likeable.user.present?
    return if @user.id == @likeable.user_id # Don't notify self

    Notification.create!(
      recipient: @likeable.user,
      actor: @user,
      action: "liked",
      notifiable: like
    )
  end

  def update_trending_stats
    return unless @likeable.is_a?(Review)
    
    song = @likeable.song
    if song
      Song.increment_counter(:likes_count, song.id)
      song.update_trending_score!
      
      if song.album
        Album.increment_counter(:likes_count, song.album_id)
        song.album.update_trending_score!
      end
    end
  end
end
