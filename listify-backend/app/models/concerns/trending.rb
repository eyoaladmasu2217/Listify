module Trending
  extend ActiveSupport::Concern

  included do
    scope :trending, -> { order(trending_score: :desc) }
  end

  def update_trending_score!
    # Trending Score = (reviews * 5) + (likes * 1) + (comments * 3) + (search * 0.5)
    # Weights can be adjusted
    score = (reviews_count * 5.0) + (likes_count * 1.0) + (comments_count * 3.0) + (search_count * 0.5)
    update_columns(trending_score: score)
  end

  def increment_search_count!
    self.class.increment_counter(:search_count, id)
    update_trending_score!
  end
end
