class AlbumSerializer < Blueprinter::Base
  identifier :id
  fields :title, :cover_url
end
