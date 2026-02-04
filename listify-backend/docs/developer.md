# Developer Guide — Listify Backend

## Prerequisites
- Ruby 3.3
- Bundler
- PostgreSQL (recommended for development)
- SQLite3 (the project is configured to use sqlite3 in the test environment and can be used locally for quick setups)
- Redis (optional, if you configure background job processing)

## Local setup
1. Copy `.env.sample` → `.env` and fill required environment variables.
2. Install dependencies:
   ```bash
   bundle install
   ```
3. Setup the database:
   ```bash
   rails db:create db:migrate db:seed
   ```
4. Start the Rails server:
   ```bash
   rails s
   ```
5. For ActiveStorage local development, ensure `storage.yml` is configured to use `local`.

## Environment variables
- `DATABASE_URL` or per-environment DB variables (see `.env.sample`)
- `DEVISE_JWT_SECRET_KEY` — secret for Devise JWT
- CORS_ALLOWED_ORIGINS — comma-separated list of allowed origins for CORS

## Branching & style
- Branch naming: `fix/*`, `feature/*`, `docs/*`, `chore/*`.
- Commit messages: use short imperative style (e.g., "Fix user following endpoint").
- Run `rubocop` and fix offenses before opening a PR.

## Tooling
- Linters: `bundle exec rubocop`.
- Security: `bundle exec brakeman -q` for static app security scans.
- HTTP client: `Faraday` is used for external API calls.

## Debugging tips
- Use `rails console` to inspect models and relationships.
- Use `rails test TEST=<file>:<line>` to run a single test.
- When debugging Deezer ingestion, enable `Rails.logger` or inspect requests with `WebMock` stubs in tests.

---

If you'd like, I can add setup scripts or a Docker Compose recipe to make local development even easier.