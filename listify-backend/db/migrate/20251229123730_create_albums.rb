class CreateAlbums < ActiveRecord::Migration[8.0]
  def change
    create_table :albums do |t|
      t.string :title
      t.string :artist_name
      t.string :cover_url
      t.bigint :deezer_id

      t.timestamps
    end
    add_index :albums, :deezer_id
  end
end
