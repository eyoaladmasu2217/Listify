class CreateCollectionItems < ActiveRecord::Migration[8.0]
  def change
    create_table :collection_items do |t|
      t.references :collection, null: false, foreign_key: true
      t.references :song, null: false, foreign_key: true
      t.integer :position

      t.timestamps
    end
    add_index :collection_items, [ :collection_id, :song_id ], unique: true
  end
end
