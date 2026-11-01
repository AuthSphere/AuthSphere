# AuthSphere Backend

Node.js API engine managing identity orchestration, cryptographic keys, and multi-tenant isolation.

[![Node.js](https://img.shields.io/badge/Backend-Node.js-339933?style=for-the-badge&logo=node.js)](https://nodejs.org/)

<p>
  <a href="https://auth-sphere-6s2v.vercel.app/">Live API</a> •
  <a href="#setup">Setup</a>
</p>

---

## Overview

The backend serves as the core API for the AuthSphere ecosystem. It handles OpenID Connect (OIDC) handshakes, manages tenant-specific cryptographic keys, and orchestrates user authentication workflows.

## Architecture & Security

The backend architecture enforces authentication on all requests and issues verifiable identity tokens.

- **Identity Signing**: Identity tokens (JWTs) are signed using project-specific RSA-2048 (RS256) private keys. Public keys are exposed for offline verification by client applications.
- **OIDC & PKCE**: Implements the Authorization Code Flow with PKCE (RFC 7636) to secure token exchanges for SPAs and mobile apps.
- **Password Hashing**: Local credentials are mathematically hashed using Argon2id/Bcrypt to provide resistance against hardware-accelerated attacks.
- **Data Encryption**: Sensitive project configurations (e.g., OAuth secrets, SMTP passwords) are stored using AES-256-GCM authenticated encryption.

## Features

- **Project Isolation**: Data and keys are cryptographically siloed per tenant environment.
- **Provider Adapters**: Normalizes payloads from Google, GitHub, and Discord into a standardized identity claim.
- **Audit Logging**: Immutable logging of critical events with fingerprinting (IP, User-Agent).
- **Email Orchestration**: Dynamically injects project-specific branding into HTML templates for OTP delivery.
- **Verification Lifecycle**: Manages state for 6-digit OTP generation and verification.

## API Endpoints

### Projects & Users

- `GET /api/v1/projects`: List identity environments.
- `POST /api/v1/projects`: Provision a new identity vault.
- `PATCH /api/v1/projects/:id`: Update security policies and configuration.
- `GET /api/v1/projects/:id/users`: Retrieve project-specific users.
- `DELETE /api/v1/projects/:id/users/:uId`: Expunge user identity records.
- `PATCH /api/v1/projects/:id/users/:uId/block`: Toggle account suspension.

### Authentication

- `POST /api/v1/auth/exchange`: PKCE code exchange.
- `POST /api/v1/auth/register`: Local identity creation.
- `POST /api/v1/auth/login-local`: Email/password authentication.
- `POST /api/v1/auth/verify-otp`: Resolution for 6-digit identity challenges.
- `GET /auth/:provider`: Initiation point for social identity handshakes.

### Telemetry

- `GET /api/v1/logs/:projectId`: Retrieve audit logs.
- `POST /api/v1/webhooks/test`: Dispatch test payloads to configured endpoints.

## Setup

**Prerequisites**:

- Node.js v20+
- MongoDB instance (local or Atlas)

```bash
# 1. Install dependencies
npm install

# 2. Configure environment
cp .env.example .env
# Important: Generate ACCESS_TOKEN_SECRET and REFRESH_TOKEN_SECRET using `openssl rand -hex 64`.

# 3. Start the server
npm run dev
```

The API will run on `http://localhost:8000` by default.

## Tech Stack

| Component     | Technology                    |
| ------------- | ----------------------------- |
| **Runtime**   | Node.js (v20+)                |
| **Framework** | Express.js                    |
| **Database**  | MongoDB, Mongoose ODM         |
| **Security**  | Node `crypto`, JWT (RFC 7519) |
| **Email**     | Nodemailer                    |
