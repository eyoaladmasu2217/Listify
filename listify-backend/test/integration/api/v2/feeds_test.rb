require "test_helper"

class Api::V2::FeedsTest < ActionDispatch::IntegrationTest
  setup do
    @user = users(:one)
    @headers = authenticated_header(@user)
  end

  test "should get following feed" do
    get api_v2_feed_following_path, headers: @headers, as: :json
    assert_response :success
    json = JSON.parse(response.body)
    assert_kind_of Array, json
  end

  test "should get explore feed" do
    get api_v2_feed_explore_path, headers: @headers, as: :json
    assert_response :success
    json = JSON.parse(response.body)
    assert_kind_of Array, json
    # Ensure it uses serializers (check for actor field)
    if json.any?
      assert json.first.key?("actor")
      assert json.first["actor"].key?("username")
    end
  end
end
