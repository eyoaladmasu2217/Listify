class User < ApplicationRecord
  devise :database_authenticatable,
         :registerable,
         :recoverable,
         :validatable,
         :jwt_authenticatable,
         jwt_revocation_strategy: JwtDenylist

  # Associations
  has_many :reviews, dependent: :destroy
  has_many :likes, dependent: :destroy
  has_many :comments, dependent: :destroy
  has_many :collections, dependent: :destroy
  has_many :activities, foreign_key: :actor_id, dependent: :destroy
  has_many :notifications, foreign_key: :recipient_id, dependent: :destroy
  has_many :refresh_tokens, dependent: :destroy


  # Social Graph Associations
  has_many :active_follows, class_name: "Follow", foreign_key: "follower_id", dependent: :destroy
  has_many :passive_follows, class_name: "Follow", foreign_key: "following_id", dependent: :destroy

  has_many :following, through: :active_follows, source: :following
  has_many :followers, through: :passive_follows, source: :follower

  has_one_attached :profile_picture

  # Provide a consistent profile_picture_url for API consumers.
  # Prefer ActiveStorage signed URLs when an attachment exists, otherwise
  # fall back to the legacy `profile_picture_url` DB column for backward compatibility.
  def profile_picture_url
    if profile_picture.attached?
      # Ensure host includes port if necessary for local development
      host = ENV.fetch("DEFAULT_URL_HOST", "localhost:3000")
      Rails.application.routes.url_helpers.rails_blob_url(profile_picture, host: host)
    else
      read_attribute(:profile_picture_url)
    end
  end

  def jwt_payload
    { "jwt_version" => jwt_version }
  end

  # Helper methods for counts
  def followers_count
    followers.count
  end

  def following_count
    following.count
  end

  # Class method for follow suggestions
  def self.suggestions_for(user, limit: 5)
    # Get users followed by people the current user follows (mutual connections)
    mutual_suggestions = User
      .joins("INNER JOIN follows AS f1 ON f1.following_id = users.id")
      .joins("INNER JOIN follows AS f2 ON f2.follower_id = f1.follower_id")
      .where("f2.following_id = ?", user.id)
      .where.not(id: user.id)
      .where.not(id: user.following.pluck(:id))
      .distinct
      .limit(limit)

    # If not enough mutual suggestions, add popular users
    if mutual_suggestions.count < limit
      popular_users = User
        .left_joins(:passive_follows)
        .where.not(id: user.id)
        .where.not(id: user.following.pluck(:id))
        .where.not(id: mutual_suggestions.pluck(:id))
        .group('users.id')
        .order('COUNT(follows.id) DESC')
        .limit(limit - mutual_suggestions.count)
      
      mutual_suggestions + popular_users
    else
      mutual_suggestions
    end
  end

  # Validations
  validates :username, presence: true, uniqueness: true
end
