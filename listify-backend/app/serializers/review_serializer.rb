class ReviewSerializer < Blueprinter::Base
  identifier :id

  fields :rating, :review_text, :created_at

  field :likes do |review|
    review.likes.count
  end

  field :comments do |review|
    review.comments.count
  end

  association :user, blueprint: UserSerializer, view: :simple
  association :song, blueprint: SongSerializer
end
