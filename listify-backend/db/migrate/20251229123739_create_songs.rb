class CreateSongs < ActiveRecord::Migration[8.0]
  def change
    create_table :songs do |t|
      t.string :title
      t.string :artist_name
      t.integer :duration_ms
      t.bigint :deezer_id
      t.string :preview_url
      t.references :album, null: true, foreign_key: true
      t.index :deezer_id

      t.timestamps
    end
  end
end
