class Review < ApplicationRecord
  # include ActivityLoggable
  belongs_to :user
  belongs_to :song

  validates :rating, presence: true, inclusion: { in: 1..5 }
  validates :user_id, uniqueness: { scope: :song_id, message: "has already reviewed this song" }

  has_many :likes, as: :likeable, dependent: :destroy
  has_many :comments, as: :commentable, dependent: :destroy
end
