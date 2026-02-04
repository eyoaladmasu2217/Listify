class Album < ApplicationRecord
  belongs_to :artist, optional: true
  has_many :songs, dependent: :nullify

  validates :title, presence: true
  validates :artist_name, presence: true
end
