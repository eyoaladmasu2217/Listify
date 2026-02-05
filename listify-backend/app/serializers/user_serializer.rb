class UserSerializer < Blueprinter::Base
  identifier :id

  fields :username, :email, :bio, :profile_picture_url, :theme, :notifications_enabled, :is_private

  view :simple do
    fields :id, :username, :profile_picture_url
  end
end
