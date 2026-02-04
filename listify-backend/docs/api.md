# API Reference — Listify Backend

This document lists the public API endpoints with examples, authentication expectations, and typical responses.

## Authentication
- The API uses **Bearer** tokens for protected endpoints. Include `Authorization: Bearer <access_token>`.
- Access tokens are short-lived (1 hour). Use the `refresh_token` flow to obtain a new access token.

### Refresh token flow (rotation)
- Endpoint: `POST /api/v2/refresh_tokens`
- Body: `{ "refresh_token": "<token>" }`
- On success: returns a new access token and a new refresh token; the old refresh token is revoked.

## Common headers
- `Authorization: Bearer <token>` — for authenticated requests.
- `Content-Type: application/json`
- `Accept: application/json`

## Error format
Errors are returned with an appropriate HTTP status and a JSON body, for example:

```json
{
  "errors": [
    { "message": "Not Authorized", "code": "not_authorized" }
  ]
}
```

## Endpoints (selected)

### Auth
- `POST /api/v1/auth/login` — Login and receive `{ access_token, refresh_token }`.
- `POST /api/v2/refresh_tokens` — Rotate an existing `refresh_token`.

### Users (V1)
- `GET /api/v1/users/me` — Return current user summary.
- `GET /api/v1/users/:id/followers` — List users following the target.
- `GET /api/v1/users/:id/following` — List users the target follows.
- `POST /api/v1/users/:id/follow` — Follow a user (Legacy/V1).

### Social (V2)
- `POST /api/v2/relationships` — Follow a user. Body: `{ "followed_id": 123 }`.
- `DELETE /api/v2/relationships/:id` — Unfollow a user (where `:id` is the user ID).

### Feed (V2)
- `GET /api/v2/feed/following` — Activity feed from users you follow.
- `GET /api/v2/feed/explore` — Global discovery feed.

### Music (V2)
- `GET /api/v2/songs` — List all songs.
- `GET /api/v2/songs/:id` — Get song details.
- `POST /api/v2/songs/sync` — Trigger Deezer ingestion.

Notes:
- The sync endpoint is idempotent and will persist entities using their external ids.
- In case of rate limit (429), the service respects `Retry-After` and retries when appropriate.

---

For full request/response examples, and parameter descriptions, see the `docs/api.md` section in this repository and the OpenAPI spec at `docs/openapi.yaml` (planned).