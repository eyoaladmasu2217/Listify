require "test_helper"

class UserTest < ActiveSupport::TestCase
  test "fixture loading" do
    assert_not_nil users(:one)
    assert_equal "user1@example.com", users(:one).email
  end
end
