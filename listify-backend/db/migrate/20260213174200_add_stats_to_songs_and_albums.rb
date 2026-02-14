class AddStatsToSongsAndAlbums < ActiveRecord::Migration[8.0]
  def change
    # Add columns to songs
    add_column :songs, :search_count, :integer, default: 0
    add_column :songs, :likes_count, :integer, default: 0
    add_column :songs, :comments_count, :integer, default: 0
    add_column :songs, :reviews_count, :integer, default: 0
    add_column :songs, :trending_score, :float, default: 0

    # Add columns to albums
    add_column :albums, :search_count, :integer, default: 0
    add_column :albums, :likes_count, :integer, default: 0
    add_column :albums, :comments_count, :integer, default: 0
    add_column :albums, :reviews_count, :integer, default: 0
    add_column :albums, :trending_score, :float, default: 0
    
    # Add indices for trending queries
    add_index :songs, :trending_score
    add_index :albums, :trending_score
  end
end
