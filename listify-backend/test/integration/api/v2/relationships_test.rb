require "test_helper"

class Api::V2::RelationshipsTest < ActionDispatch::IntegrationTest
  setup do
    @user = users(:one)
    @other_user = users(:two)
    @headers = authenticated_header(@user)
  end

  test "should follow a user" do
    assert_difference "Follow.count", 1 do
      post api_v2_relationships_path,
           params: { followed_id: @other_user.id },
           headers: @headers,
           as: :json
    end
    assert_response :created
    assert_equal "Successfully followed", JSON.parse(response.body)["message"]
  end

  test "should unfollow a user" do
    # First follow
    @user.active_follows.create!(following: @other_user)

    assert_difference "Follow.count", -1 do
      delete api_v2_relationship_path(@other_user.id),
             headers: @headers,
             as: :json
    end
    assert_response :ok
    assert_equal "Successfully unfollowed", JSON.parse(response.body)["message"]
  end

  test "should not follow self" do
    post api_v2_relationships_path,
         params: { followed_id: @user.id },
         headers: @headers,
         as: :json
    assert_response :unprocessable_entity
    assert_includes JSON.parse(response.body)["error"], "cannot follow self"
  end
end
