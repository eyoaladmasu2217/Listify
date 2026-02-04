# db/seeds.rb

puts "Seeding data..."

# Users
demo = User.find_or_create_by!(email: "demo@example.com") do |u|
  u.username = "demo_user"
  u.password = "password"
  u.profile_picture_url = "https://ui-avatars.com/api/?name=Demo+User&background=1DB954&color=fff"
end

eyoal = User.find_or_create_by!(email: "eyoal@example.com") do |u|
  u.username = "Eyoal Yeshewas"
  u.password = "password123"
  u.profile_picture_url = "https://ui-avatars.com/api/?name=Eyoal+Yeshewas&background=0D8ABC&color=fff"
end

estifanos = User.find_or_create_by!(email: "estifanos@example.com") do |u|
  u.username = "Estifanos"
  u.password = "password123"
  u.profile_picture_url = "https://ui-avatars.com/api/?name=Estifanos&background=black&color=fff"
end

nati = User.find_or_create_by!(email: "nati@example.com") do |u|
  u.username = "Nati"
  u.password = "password123"
  u.profile_picture_url = "https://ui-avatars.com/api/?name=Nati&background=random"
end

kidus = User.find_or_create_by!(email: "kidus@example.com") do |u|
  u.username = "Kidus Amare"
  u.password = "password123"
  u.profile_picture_url = "https://ui-avatars.com/api/?name=Kidus+Amare&background=random"
end

puts "Created Users: #{User.count}"

# Follows (Make them follow each other for the feed)
[estifanos, nati, kidus].each do |user|
  Follow.find_or_create_by!(follower: demo, following: user)
end

# Albums
thriller = Album.find_or_create_by!(title: "Thriller", artist_name: "Michael Jackson") do |a|
  a.cover_url = "https://i.scdn.co/image/ab67616d0000b27341fdc42a265cfd2800c43f33" # Real-ish URL or placeholder
  a.deezer_id = 101
end

abbey_road = Album.find_or_create_by!(title: "Abbey Road", artist_name: "The Beatles") do |a|
  a.cover_url = "https://upload.wikimedia.org/wikipedia/en/4/42/Beatles_-_Abbey_Road.jpg"
  a.deezer_id = 102
end

ram = Album.find_or_create_by!(title: "Random Access Memories", artist_name: "Daft Punk") do |a|
  a.cover_url = "https://upload.wikimedia.org/wikipedia/en/a/a7/Random_Access_Memories.jpg"
  a.deezer_id = 103
end

puts "Created Albums: #{Album.count}"

# Songs
songs_data = [
  { title: "Billie Jean", artist_name: "Michael Jackson", album: thriller, duration_ms: 294000, deezer_id: 1001, preview_url: "https://example.com/billie_jean.mp3" },
  { title: "Come Together", artist_name: "The Beatles", album: abbey_road, duration_ms: 259000, deezer_id: 1004, preview_url: "https://example.com/come_together.mp3" },
  { title: "Get Lucky", artist_name: "Daft Punk", album: ram, duration_ms: 369000, deezer_id: 1007, preview_url: "https://example.com/get_lucky.mp3" }
]

created_songs = songs_data.map do |data|
  Song.find_or_create_by!(title: data[:title], artist_name: data[:artist_name]) do |s|
    s.album = data[:album]
    s.duration_ms = data[:duration_ms]
    s.deezer_id = data[:deezer_id]
    s.preview_url = data[:preview_url]
  end
end

puts "Created Songs: #{Song.count}"

# Reviews & Activity
# We create reviews which automatically (via callbacks/logic) create activities if implemented,
# or we manually create activities if the system expects them for the feed.
# For now, let's create reviews and assume the feed logic fetches them or their activities.

Review.find_or_create_by!(user: estifanos, song: created_songs[0]) do |r|
  r.rating = 5
  r.review_text = "An absolute classic! Must listen."
end

Review.find_or_create_by!(user: nati, song: created_songs[1]) do |r|
  r.rating = 4
  r.review_text = "Great production, though a bit long."
end

Review.find_or_create_by!(user: kidus, song: created_songs[2]) do |r|
  r.rating = 5
  r.review_text = "Revolutionary electronic music."
end

# Manually create activities if they aren't created by callbacks
Review.all.each do |review|
  Activity.find_or_create_by!(
    actor: review.user,
    target: review,
    action_type: "review"
  )
end

puts "Created Reviews: #{Review.count}"
puts "Created Activities: #{Activity.count}"
puts "Seeding complete!"
