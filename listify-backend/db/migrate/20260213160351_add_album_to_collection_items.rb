class AddAlbumToCollectionItems < ActiveRecord::Migration[8.0]
  def change
    add_reference :collection_items, :album, null: true, foreign_key: true
    change_column_null :collection_items, :song_id, true
  end
end
