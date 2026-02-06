class UserSerializer < Blueprinter::Base
  identifier :id

  fields :username, :email, :bio, :profile_picture_url, :theme, :notifications_enabled, :is_private

  field :reviews_count do |user|
    user.reviews.count
  end

  field :followers_count do |user|
    user.followers.count
  end

  field :following_count do |user|
    user.following.count
  end

  field :is_following do |user, options|
    if options[:current_user]
      is_following = options[:current_user].following.exists?(user.id)
      Rails.logger.info "DEBUG: UserSerializer checking is_following for #{user.username} by #{options[:current_user].username}: #{is_following}"
      is_following
    else
      false
    end
  end

  view :simple do
    fields :id, :username, :profile_picture_url
  end

  view :profile do
    include_view :simple
    fields :bio, :email, :reviews_count, :followers_count, :following_count, :is_private, :is_following
  end
end
