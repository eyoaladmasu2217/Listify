require "test_helper"

class Api::V2::FeedControllerTest < ActionDispatch::IntegrationTest
  setup do
    @user = users(:one)
    @headers = Devise::JWT::TestHelpers.auth_headers({}, @user)
  end

  test "should get following feed" do
    get api_v2_feed_following_url, headers: @headers, as: :json
    assert_response :success
    body = JSON.parse(response.body)
    assert_kind_of Array, body
  end

  test "should get explore feed" do
    get api_v2_feed_explore_url, headers: @headers, as: :json
    assert_response :success
    body = JSON.parse(response.body)
    assert_kind_of Array, body

    # Ensure it doesn't contain own activities
    body.each do |activity|
      assert_not_equal @user.id, activity["actor_id"]
    end
  end
end
