require "test_helper"

class Api::V2::RelationshipsControllerTest < ActionDispatch::IntegrationTest
  setup do
    @user = users(:one)
    @other = users(:two)
    @headers = Devise::JWT::TestHelpers.auth_headers({}, @user)
  end

  test "should follow user" do
    assert_difference("Follow.count") do
      post api_v2_relationships_url,
           params: { followed_id: @other.id },
           headers: @headers,
           as: :json
    end
    assert_response :created
  end

  test "should unfollow user" do
    @user.active_follows.create!(following: @other)

    assert_difference("Follow.count", -1) do
      delete api_v2_relationship_url(@other), headers: @headers, as: :json
    end
    assert_response :ok
  end

  test "should handle invalid follow" do
    post api_v2_relationships_url,
         params: { followed_id: 999999 },
         headers: @headers,
         as: :json
    assert_response :unprocessable_entity
    assert_match(/User not found/, response.body)
  end
end
