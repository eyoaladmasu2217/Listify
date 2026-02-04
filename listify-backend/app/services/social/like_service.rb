class Social::LikeService < BaseService
  def initialize(user, likeable)
    @user = user
    @likeable = likeable
  end

  def call
    ActiveRecord::Base.transaction do
      like = Like.find_or_initialize_by(user: @user, likeable: @likeable)

      if like.new_record?
        if like.save
          create_activity(like)
          create_notification(like)
          success(like)
        else
          failure(like.errors.full_messages)
        end
      else
        failure("Already liked")
      end
    end
  rescue StandardError => e
    failure(e.message)
  end

  private

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
end
