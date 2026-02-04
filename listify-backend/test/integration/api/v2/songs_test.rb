require "test_helper"

class Api::V2::SongsTest < ActionDispatch::IntegrationTest
  setup do
    @user = users(:one)
    @headers = authenticated_header(@user)
    @song = songs(:one)
  end

  test "should get songs index" do
    get api_v2_songs_path, headers: @headers, as: :json
    assert_response :success
    json = JSON.parse(response.body)
    assert_kind_of Array, json
  end

  test "should show song" do
    get api_v2_song_path(@song), headers: @headers, as: :json
    assert_response :success
    json = JSON.parse(response.body)
    assert_equal @song.id, json["id"]
    assert json.key?("artist")
  end

  test "should fail for missing song" do
    get api_v2_song_path(-1), headers: @headers, as: :json
    assert_response :not_found
  end

  test "should sync songs from deezer" do
    # Stub the Deezer API call
    stub_body = { data: [ { "id" => 1, "title" => "Song", "duration" => 180, "preview" => "http://p", "artist" => { "id" => 10, "name" => "Artist" }, "album" => { "id" => 20, "title" => "Album", "cover_medium" => "http://c" } } ] }.to_json
    stub_request(:get, "https://api.deezer.com/search").with(query: hash_including(q: "Daft Punk")).to_return(status: 200, body: stub_body)

    post sync_api_v2_songs_path,
         params: { query: "Daft Punk" },
         headers: @headers,
         as: :json

    assert_response :success
  end
end
