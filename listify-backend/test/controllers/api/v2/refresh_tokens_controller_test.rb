require "test_helper"

class Api::V2::RefreshTokensControllerTest < ActionDispatch::IntegrationTest
  setup do
    @user = users(:one)
  end

  test "jwt payload expiry matches configured 1 hour" do
    token, payload = Warden::JWTAuth::UserEncoder.new.call(@user, :user, nil)

    assert_equal 3600, payload["exp"] - payload["iat"]
  end

  test "rotation endpoint returns expires_in matching payload" do
    refresh = @user.refresh_tokens.create!

    post api_v2_refresh_tokens_url, params: { refresh_token: refresh.token }
    assert_response :success

    body = JSON.parse(response.body)
    assert_equal 3600, body["expires_in"]
  end
end
