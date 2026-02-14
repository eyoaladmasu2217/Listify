class Content::CreateCommentService < BaseService
  def initialize(user, commentable, text)
    @user = user
    @commentable = commentable
    @text = text
  end

  def call
    ActiveRecord::Base.transaction do
      comment = @user.comments.build(commentable: @commentable, text: @text)

      if comment.save
        create_activity(comment)
        create_notification(comment)
        update_trending_stats
        success(comment)
      else
        failure(comment.errors.full_messages)
      end
    end
  rescue StandardError => e
    failure(e.message)
  end

  private

  def create_activity(comment)
    Activity.create!(
      actor: @user,
      action_type: "commented",
      target: @commentable
    )
  end

  def create_notification(comment)
    return unless @commentable.respond_to?(:user) && @commentable.user.present?
    return if @user.id == @commentable.user_id

    Notification.create!(
      recipient: @commentable.user,
      actor: @user,
      action: "commented",
      notifiable: comment
    )
  end

  def update_trending_stats
    return unless @commentable.is_a?(Review)
    
    song = @commentable.song
    if song
      Song.increment_counter(:comments_count, song.id)
      song.update_trending_score!
      
      if song.album
        Album.increment_counter(:comments_count, song.album_id)
        song.album.update_trending_score!
      end
    end
  end
end
