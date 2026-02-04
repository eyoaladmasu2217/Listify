class RefreshToken < ApplicationRecord
  belongs_to :user

  before_validation :generate_token, on: :create
  before_validation :set_expiration, on: :create

  validates :token, presence: true, uniqueness: true
  validates :expires_at, presence: true

  def active?
    expires_at > Time.current && revoked_at.nil?
  end

  def revoke!
    update!(revoked_at: Time.current)
  end

  private

  def generate_token
    self.token ||= SecureRandom.hex(32)
  end

  def set_expiration
    self.expires_at ||= 30.days.from_now
  end
end
