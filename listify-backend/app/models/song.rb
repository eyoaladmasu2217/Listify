class Song < ApplicationRecord
  belongs_to :artist, optional: true
  belongs_to :album, optional: true

  validates :title, presence: true
  validates :artist_name, presence: true

  has_one_attached :cover_art

  # ActiveStorage validations
  validates :cover_art, content_type: [ "image/png", "image/jpeg", "image/webp" ],
                        size: { less_than: 5.megabytes }

  has_many :reviews, dependent: :destroy
  
  def cover_url
    if cover_art.attached?
      Rails.application.routes.url_helpers.rails_blob_url(cover_art, host: ENV.fetch("DEFAULT_URL_HOST", "localhost:3000"))
    else
      album&.cover_url
    end
  end
end
