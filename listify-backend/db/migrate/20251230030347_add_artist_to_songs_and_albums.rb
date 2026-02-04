class AddArtistToSongsAndAlbums < ActiveRecord::Migration[8.0]
  def change
    add_reference :songs, :artist, null: true, foreign_key: true
    add_reference :albums, :artist, null: true, foreign_key: true
    add_column :songs, :lyrics, :text
  end
end
