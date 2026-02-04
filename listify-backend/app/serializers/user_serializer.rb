class UserSerializer < Blueprinter::Base
  identifier :id

  fields :username, :email, :bio, :profile_picture_url

  view :simple do
    fields :id, :username, :profile_picture_url
  end
end
