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
      Rails.application.routes.url_helpers.rails_blob_url(profile_picture, host: ENV.fetch("DEFAULT_URL_HOST", "localhost:3000"))
    else
      read_attribute(:profile_picture_url)
    end
  end

  def jwt_payload
    { "jwt_version" => jwt_version }
  end

  # Validations
  validates :username, presence: true, uniqueness: true
end
