class ActivitySerializer < Blueprinter::Base
  identifier :id

  fields :action_type, :created_at

  association :actor, blueprint: UserSerializer, view: :simple

  field :target do |activity, options|
    target = activity.target
    next nil unless target

    case activity.target_type
    when "User"
      { type: "User", id: target.id, username: target.username }
    when "Song"
      { type: "Song", id: target.id, title: target.title, artist_name: target.artist_name, cover_url: target.album&.cover_url }
    when "Review"
      { 
        type: "Review", 
        id: target.id, 
        rating: target.rating, 
        song_id: target.song_id,
        song_title: target.song&.title,
        song_artist: target.song&.artist_name,
        song_cover: target.song&.album&.cover_url,
        review_text: target.review_text
      }
    when "Collection"
      { type: "Collection", id: target.id, title: target.title }
    else
      { type: activity.target_type, id: target.id }
    end
  end
end
