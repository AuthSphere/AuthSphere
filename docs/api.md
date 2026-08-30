# API Reference

Detailed documentation for the AuthSphere REST API and WebSocket events will be provided here.

## REST API Endpoints

### Authentication
- `POST /api/v1/auth/login`
  Initiates the login flow. Expects PKCE challenge.
- `POST /api/v1/auth/token`
  Exchanges an authorization code and PKCE verifier for an access token and ID token.
- `POST /api/v1/auth/logout`
  Invalidates the current session and revokes refresh tokens.

### Identity Management
- `GET /api/v1/users/me`
  Retrieves the profile of the currently authenticated user.
- `POST /api/v1/users/register`
  Registers a new user (if public registration is enabled for the tenant).

### Admin & Tenant Config
- `GET /api/v1/admin/users`
  (Admin only) Lists all users within the tenant.
- `PUT /api/v1/admin/config/oauth`
  (Admin only) Configures OAuth provider credentials.

## WebSocket Telemetry

The API Engine exposes a WebSocket namespace at `/telemetry` for real-time events.

**Events Emitted:**
- `auth:success`: Triggered when a user successfully logs in.
- `auth:failure`: Triggered on failed login attempts (e.g., incorrect password, blocked account).
- `user:created`: Triggered when a new user registers.

Clients authenticate with the WebSocket server by passing an Admin API key in the connection handshake.
