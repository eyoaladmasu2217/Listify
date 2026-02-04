require "test_helper"

class Music::DeezerSyncServiceTest < ActiveSupport::TestCase
  setup do
    @service = Music::DeezerSyncService.new("Daft Punk")
  end

  test "successful fetch processes tracks" do
    stub_body = { data: [ { "id" => 1, "title" => "Song", "duration" => 180, "preview" => "http://p", "artist" => { "id" => 10, "name" => "Artist" }, "album" => { "id" => 20, "title" => "Album", "cover_medium" => "http://c" } } ] }.to_json

    stub_request(:get, "https://api.deezer.com/search").with(query: hash_including(q: "Daft Punk")).to_return(status: 200, body: stub_body)

    result = Music::DeezerSyncService.new("Daft Punk").call
    assert result.success?
    assert_equal 1, result.data.size
    assert_equal 1, result.data.first.deezer_id
  end

  test "handles non-success response" do
    stub_request(:get, "https://api.deezer.com/search").with(query: hash_including(q: "Daft Punk")).to_return(status: 500, body: "error")

    result = Music::DeezerSyncService.new("Daft Punk").call
    assert_not result.success?
    assert_match(/Deezer API returned status 500/, result.errors.first)
  end

  test "handles rate limit response" do
    stub_request(:get, "https://api.deezer.com/search").with(query: hash_including(q: "Daft Punk")).to_return(status: 429, headers: { "Retry-After" => "10" }, body: "rate limited")

    service = Music::DeezerSyncService.new("Daft Punk")
    # Stub sleep to avoid waiting during tests using singleton method
    def service.sleep(_); end

    result = service.call
    assert_not result.success?
    assert_match(/rate limited/i, result.errors.first)
  end

  test "supports pagination params" do
    stub_body = { data: [ { "id" => 2, "title" => "Song 2", "duration" => 120, "preview" => "http://p2", "artist" => { "id" => 11, "name" => "Artist 2" }, "album" => { "id" => 21, "title" => "Album 2", "cover_medium" => "http://c2" } } ] }.to_json

    stub_request(:get, "https://api.deezer.com/search").with(query: hash_including(q: "Daft Punk", "limit" => "1", "index" => "2")).to_return(status: 200, body: stub_body)

    result = Music::DeezerSyncService.new("Daft Punk", limit: 1, index: 2).call
    assert result.success?
    assert_equal 1, result.data.size
    assert_equal 2, result.data.first.deezer_id
  end
end
