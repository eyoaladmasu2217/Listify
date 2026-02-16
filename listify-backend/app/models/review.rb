class Review < ApplicationRecord
  # include ActivityLoggable
  belongs_to :user
  belongs_to :song, counter_cache: true
  
  after_create :increment_album_reviews
  after_destroy :decrement_album_reviews
  after_commit :update_stats, on: [:create, :update, :destroy]

  validates :rating, presence: true, inclusion: { in: 1..5 }
  validates :user_id, uniqueness: { scope: :song_id, message: "has already reviewed this song" }

  has_many :likes, as: :likeable, dependent: :destroy
  has_many :comments, as: :commentable, dependent: :destroy

  private

  def increment_album_reviews
    return unless song&.album_id
    Album.increment_counter(:reviews_count, song.album_id)
  end

  def decrement_album_reviews
    return unless song&.album_id
    Album.decrement_counter(:reviews_count, song.album_id)
  end

  def update_stats
    song&.update_trending_score!
    song&.album&.update_trending_score!
  end
end
