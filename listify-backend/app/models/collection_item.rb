class CollectionItem < ApplicationRecord
  belongs_to :collection
  belongs_to :song, optional: true
  belongs_to :album, optional: true

  before_create :assign_position
  
  validate :must_have_item
  validates :song_id, uniqueness: { scope: :collection_id, message: "is already in this collection" }, if: -> { song_id.present? }
  validates :album_id, uniqueness: { scope: :collection_id, message: "is already in this collection" }, if: -> { album_id.present? }

  private

  def must_have_item
    if song_id.blank? && album_id.blank?
      errors.add(:base, "Must have either a song or an album")
    end
  end

  def assign_position
    return if position.present?
    max_position = collection.collection_items.maximum(:position) || 0
    self.position = max_position + 1
  end
end
