class Comment < ApplicationRecord
  # include ActivityLoggable
  belongs_to :user
  belongs_to :commentable, polymorphic: true

  # after_create :create_notification

  private

  # Side effects moved to Content::CreateCommentService
  def create_notification
  end
end
