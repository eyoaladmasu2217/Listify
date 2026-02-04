# Testing — Listify Backend

## Test suite
This project uses Minitest for unit and integration tests.

### Run all tests
```bash
rails test
```

### Run a single test file or a single test
```bash
rails test test/services/music/deezer_sync_service_test.rb
rails test TEST=test/services/music/deezer_sync_service_test.rb:24
```

### Test environment notes (Windows)
- Bootsnap is disabled for tests to avoid Windows-specific issues.
- Tests run against sqlite3 by default in the `test` environment (configured in `config/database.yml`).

### Stubbing external HTTP
- `WebMock` is used to stub Deezer API calls in tests. Use precise `with(query: hash_including(...))` expectations to avoid brittle stubs.

Example stub:
```ruby
stub_request(:get, /api.deezer.com/)
  .with(query: hash_including({ q: 'artist:"Daft Punk"' }))
  .to_return(status: 200, body: JSON.generate(response_hash))
```

### Rate limit tests
- The Deezer service implements respect for `Retry-After` headers.
- **Optimization**: We use a singleton method stub for sleep in tests to avoid real delays:
  ```ruby
  def service.sleep(_); end
  ```

### Continuous Integration
- CI should run: `bundle install`, `rubocop`, `brakeman`, `rails db:migrate RAILS_ENV=test`, and then `rails test`.

---

If you want, I can add automated test helpers, fixtures, or VCR-type snapshots to make HTTP-dependent tests even more deterministic.