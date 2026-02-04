# Architecture — Listify Backend

## Overview
Listify is a service-oriented Rails API designed to handle social graph interactions and music metadata ingestion from third-party providers (currently Deezer). The core goals are to preserve controller thinness, encapsulate business logic in service objects, and keep authentication secure via short-lived JWTs and rotating refresh tokens.

## High-level components
- API Layer (v1, v2): Controllers expose RESTful endpoints for user, social, and music resources.
- Services: `app/services` contains domain-focused service objects (e.g., `Music::DeezerSyncService`, `Social::FollowUserService`).
- Models: ActiveRecord models for Users, Songs, Albums, Artists, Collections, Activities, RefreshTokens, JWT denylist.
- Background Jobs: Jobs for async processing and retrying long-running tasks (e.g., exporting activity, delayed ingestion).
- External Integrations: Deezer API for song/artist/album metadata ingestion.
- Storage: ActiveStorage for profile pictures and media attachments.
- Middleware: `Rack::Attack` for rate limiting/throttling requests.

## Key data relationships
- User
  - has_many :activities
  - has_many :followers, through: :follows
  - has_many :following, through: :follows
  - has_many :refresh_tokens
- Artist
  - has_many :albums
  - has_many :songs, through: :albums
- Album
  - belongs_to :artist
  - has_many :songs
- Song
  - belongs_to :album
  - has_one :artist, through: :album

## Authentication model
- Devise is used for core user authentication.
- `devise-jwt` issues short-lived access tokens (configured to 1 hour).
- Refresh tokens are persisted in `RefreshToken` model and are rotated on use.
- `jwt_version` on the user model supports global token invalidation.

## Deezer ingestion sequence
1. POST `/api/v2/songs/sync` (authenticated admin API) triggers `Music::DeezerSyncService`.
2. Service fetches tracks using paginated Deezer endpoints with limit and index params.
3. On 429 responses, the service respects `Retry-After` and retries as configured.
4. Tracks are persisted idempotently (find_or_initialize_by external id) inside transactions.

## Scaling & operations notes
- Prefer horizontal scaling for web dynos; ensure background jobs are separated.
- Use an external object store (S3) for ActiveStorage in production.
- Monitor JWT issuance and refresh token stores; consider TTL cleanup jobs for expired refresh tokens.

---

For an overview diagram, see the top of the main `README.md` or the `docs/` directory for additional diagrams.