class CreateReviews < ActiveRecord::Migration[8.0]
  def change
    create_table :reviews do |t|
      t.references :user, null: false, foreign_key: true
      t.references :song, null: false, foreign_key: true
      t.integer :rating
      t.text :review_text

      t.timestamps
    end
    add_index :reviews, [ :user_id, :song_id ], unique: true
  end
end
