# Security Specifications

AuthSphere implements security at every layer of the OS stack.

## Authentication (PKCE S256)
Enforces Proof Key for Code Exchange to prevent MITM and code injection attacks on public clients.

## Cryptography
- **Password Storage**: Uses Argon2id / Bcrypt
- **Token Integrity**: RSA-SHA256 (RS256) with 2048-bit private keys.
- **Data at Rest**: AES-256-GCM authenticated encryption for sensitive project configurations.

## Session Management

- **Stateless Verification**: Access tokens are JWTs verified cryptographically by the API Engine or any client with the Public Key, minimizing database lookups.
- **Revocation**: Refresh tokens are stateful. When a user logs out or an admin blocks an account, the refresh token family is immediately revoked in the database.
- **httpOnly Cookies**: Refresh tokens are strictly delivered via `httpOnly`, `Secure`, `SameSite=Strict` cookies to prevent Cross-Site Scripting (XSS) attacks.

## Rate Limiting & Brute Force Protection

- **IP-Based Limiting**: The API Engine enforces strict rate limits on authentication endpoints (e.g., `/api/v1/auth/login`) to prevent brute-force credential stuffing.
- **Account Lockout**: After multiple consecutive failed login attempts, the target account is temporarily locked, and an event is emitted via the telemetry stream.

## Audit Logging

Every significant security event is recorded in the MongoDB `audit_logs` collection:
- Logins (Success/Failure)
- Password Resets
- MFA Enrollment
- Admin Configuration Changes

Logs are immutable and include the actor's ID, IP address, user agent, and timestamp.
