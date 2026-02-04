require "test_helper"

class Api::V1::FollowsTest < ActionDispatch::IntegrationTest
  setup do
    @user = users(:one)
    @other = users(:two)
    @headers = Devise::JWT::TestHelpers.auth_headers({}, @user)
  end

  test "should follow user via V1 endpoint" do
    assert_difference("Follow.count") do
      post api_v1_user_follow_url(@other), headers: @headers, as: :json
    end
    assert_response :success
  end

  test "should unfollow user via V1 endpoint" do
    # Create follow first
    @user.active_follows.create!(following: @other)

    assert_difference("Follow.count", -1) do
      delete api_v1_user_follow_url(@other), headers: @headers, as: :json
    end
    assert_response :success
  end
end
