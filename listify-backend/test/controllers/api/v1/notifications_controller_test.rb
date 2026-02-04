require "test_helper"

class Api::V1::NotificationsControllerTest < ActionDispatch::IntegrationTest
  setup do
    @user = users(:one)
    @headers = Devise::JWT::TestHelpers.auth_headers({}, @user)
  end

  test "should get index" do
    get api_v1_notifications_url, headers: @headers
    assert_response :success
  end

  test "should mark notification as read" do
    notification = @user.notifications.first || notifications(:one)
    patch read_api_v1_notification_url(notification), headers: @headers
    assert_response :success
  end
end
