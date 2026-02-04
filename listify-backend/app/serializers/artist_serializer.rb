class ArtistSerializer < Blueprinter::Base
  identifier :id
  fields :name, :bio, :deezer_id
end
