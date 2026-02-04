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
end
