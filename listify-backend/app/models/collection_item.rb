class CollectionItem < ApplicationRecord
  belongs_to :collection
  belongs_to :song

  before_create :assign_position
  validates :song_id, uniqueness: { scope: :collection_id, message: "is already in this collection" }

  private

  def assign_position
    return if position.present?
    max_position = collection.collection_items.maximum(:position) || 0
    self.position = max_position + 1
  end
end
