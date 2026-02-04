class Artist < ApplicationRecord
  has_many :songs, dependent: :nullify
  has_many :albums, dependent: :nullify

  validates :name, presence: true
  validates :deezer_id, uniqueness: true, allow_nil: true
end
