module Trending
  extend ActiveSupport::Concern

  TRENDING_WEIGHTS = {
    reviews: 5.0,
    likes: 1.0,
    comments: 3.0,
    search: 0.5
  }.freeze

  included do
    scope :trending, -> { order(trending_score: :desc) }
  end

  def update_trending_score!
    # Trending Score = weighted sum of interactions
    score = (reviews_count * TRENDING_WEIGHTS[:reviews]) +
            (likes_count * TRENDING_WEIGHTS[:likes]) +
            (comments_count * TRENDING_WEIGHTS[:comments]) +
            (search_count * TRENDING_WEIGHTS[:search])
    
    update_columns(trending_score: score)
  end

  def increment_search_count!
    self.class.increment_counter(:search_count, id)
    update_trending_score!
  end
end
