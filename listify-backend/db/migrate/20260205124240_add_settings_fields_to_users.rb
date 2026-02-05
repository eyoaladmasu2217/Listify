class AddSettingsFieldsToUsers < ActiveRecord::Migration[8.0]
  def change
    add_column :users, :notifications_enabled, :boolean, default: true
    add_column :users, :is_private, :boolean, default: false
  end
end
