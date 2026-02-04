class CreateArtists < ActiveRecord::Migration[8.0]
  def change
    create_table :artists do |t|
      t.string :name
      t.text :bio
      t.bigint :deezer_id

      t.timestamps
    end
    add_index :artists, :deezer_id
  end
end
