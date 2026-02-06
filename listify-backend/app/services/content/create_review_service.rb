class Content::CreateReviewService < BaseService
  def initialize(user, review_params)
    @user = user
    @params = review_params
  end

  def call
    ActiveRecord::Base.transaction do
      review = @user.reviews.build(@params)

      if review.save
        create_activity(review)
        success(review)
      else
        failure(review.errors.full_messages)
      end
    end
  rescue StandardError => e
    failure(e.message)
  end

  private

  def create_activity(review)
    Activity.create!(
      actor: @user,
      action_type: "reviewed",
      target: review
    )
  end
end
