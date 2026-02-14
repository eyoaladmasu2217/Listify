class AddCountersToReviews < ActiveRecord::Migration[8.0]
  def change
    add_column :reviews, :likes_count, :integer, default: 0
    add_column :reviews, :comments_count, :integer, default: 0
    
    # Optional: Update existing reviews
    Review.reset_column_information
    Review.all.each do |review|
      Review.reset_counters(review.id, :likes)
      Review.reset_counters(review.id, :comments)
    end
  end
end
