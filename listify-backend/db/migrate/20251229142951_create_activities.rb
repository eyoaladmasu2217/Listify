class CreateActivities < ActiveRecord::Migration[8.0]
  def change
    create_table :activities do |t|
      t.string :action_type
      t.references :target, polymorphic: true, null: false
      t.references :actor, null: false, foreign_key: { to_table: :users }

      t.timestamps
    end
  end
end
