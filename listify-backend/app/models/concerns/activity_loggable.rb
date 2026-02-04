module ActivityLoggable
  extend ActiveSupport::Concern

  included do
    after_create :log_activity
  end

  private

  def log_activity
    # Determine the target. For Like/Comment, it's the polymorphic parent.
    # For Follow, it's the followed user. For Review, it's the Song (or maybe the review itself?).
    # Plan says: "User 1 liked Review 5".
    # Activity: actor=User1, action="liked_review", target=Review5

    target = self.try(:likeable) || self.try(:commentable) || self.try(:following) || self.try(:song) || self

    # Custom mapping for action names
    action_key = case self.class.name
    when "Like"
                   "liked"
    when "Comment"
                   "commented"
    when "Follow"
                   "followed"
    when "Review"
                   "reviewed"
    when "Collection"
                   "created_collection"
    else
                   "created_#{self.class.name.underscore}"
    end

    Activity.create(
      actor: self.try(:user) || self.try(:follower), # Follow model uses 'follower'
      action_type: action_key,
      target: target
    )
  end
end
