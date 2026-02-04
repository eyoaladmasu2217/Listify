class Social::FollowUserService < BaseService
  def initialize(follower, following_id)
    @follower = follower
    @following_id = following_id
  end

  def call
    return failure("Follower cannot follow self") if @follower.id == @following_id.to_i

    following = User.find_by(id: @following_id)
    return failure("User not found") unless following

    ActiveRecord::Base.transaction do
      follow = @follower.active_follows.build(following: following)

      if follow.save
        # Explicit side effects in the Service Layer
        create_activity(follow, following)
        create_notification(follow, following)
        success(follow)
      else
        failure(follow.errors.full_messages)
      end
    end
  rescue ActiveRecord::RecordNotUnique
    failure("Already following this user")
  rescue StandardError => e
    failure(e.message)
  end

  private

  def create_activity(follow, following)
    Activity.create!(
      actor: @follower,
      action_type: "followed",
      target: following
    )
  end

  def create_notification(follow, following)
    Notification.create!(
      recipient: following,
      actor: @follower,
      action: "followed",
      notifiable: follow
    )
  end
end
