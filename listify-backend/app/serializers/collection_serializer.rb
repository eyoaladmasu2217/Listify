class CollectionSerializer < Blueprinter::Base
  identifier :id
  fields :title, :description, :public

  association :songs, blueprint: SongSerializer
  association :albums, blueprint: AlbumSerializer
end
