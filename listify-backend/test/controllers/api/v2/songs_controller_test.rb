require "test_helper"

class Api::V2::SongsControllerTest < ActionDispatch::IntegrationTest
  setup do
    @user = users(:one)
    @song = songs(:one)
    @headers = Devise::JWT::TestHelpers.auth_headers({}, @user)
  end

  test "should get index" do
    get api_v2_songs_url, headers: @headers, as: :json
    assert_response :success
    body = JSON.parse(response.body)
    assert_not_empty body
  end

  test "should show song" do
    get api_v2_song_url(@song), headers: @headers, as: :json
    assert_response :success
    body = JSON.parse(response.body)
    assert_equal @song.id, body["id"]
  end

  test "should sync songs" do
    # Reuse the stubbed logic from songs_test.rb validation
    stub_body = { data: [ { "id" => 1, "title" => "Song", "duration" => 180, "preview" => "http://p", "artist" => { "id" => 10, "name" => "Artist" }, "album" => { "id" => 20, "title" => "Album", "cover_medium" => "http://c" } } ] }.to_json
    stub_request(:get, "https://api.deezer.com/search").with(query: hash_including(q: "Test")).to_return(status: 200, body: stub_body)

    post sync_api_v2_songs_url, params: { query: "Test" }, headers: @headers, as: :json
    assert_response :success
  end
end
