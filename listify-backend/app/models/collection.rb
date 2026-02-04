class Collection < ApplicationRecord
  include ActivityLoggable
  belongs_to :user
  has_many :collection_items, dependent: :destroy
  has_many :songs, through: :collection_items

  validates :title, presence: true
end
