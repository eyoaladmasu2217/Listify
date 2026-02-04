class SongSerializer < Blueprinter::Base
  identifier :id
  fields :title, :duration_ms, :preview_url, :artist_name, :lyrics

  association :artist, blueprint: ArtistSerializer
  association :album, blueprint: AlbumSerializer
end
