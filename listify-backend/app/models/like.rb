class Like < ApplicationRecord
  include ActivityLoggable
  belongs_to :user
  belongs_to :likeable, polymorphic: true, counter_cache: true

  validates :user_id, uniqueness: { scope: [ :likeable_type, :likeable_id ], message: "has already liked this" }

  # after_create :create_notification

  private

  # Side effects moved to Social::LikeService
  def create_notification
  end
end
