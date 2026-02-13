class SongSerializer < Blueprinter::Base
  identifier :id
  fields :title, :duration_ms, :preview_url, :artist_name, :lyrics
  
  field :cover_url do |song|
    song.album&.cover_url
  end

  association :artist, blueprint: ArtistSerializer
  association :album, blueprint: AlbumSerializer
end
