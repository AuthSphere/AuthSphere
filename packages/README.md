<div align="center">
  <img src="assets/Gemini_Generated_Image_swlzriswlzriswlz.png" alt="AuthSphere Logo" width="120" />

# AuthSphere SDK

TypeScript client library for AuthSphere identity orchestration.

[![npm version](https://img.shields.io/npm/v/@authspherejs/sdk.svg?style=for-the-badge&logo=npm)](https://www.npmjs.com/package/@authspherejs/sdk)
[![license](https://img.shields.io/npm/l/@authspherejs/sdk.svg?style=for-the-badge)](https://github.com/madhav9757/AuthSphere/blob/main/LICENSE)
[![bundle size](https://img.shields.io/bundlephobia/minzip/@authspherejs/sdk?style=for-the-badge)](https://bundlephobia.com/package/@authspherejs/sdk)

<p>
  <a href="#installation">Installation</a> •
  <a href="#usage">Usage</a> •
  <a href="#api-reference">API Reference</a>
</p>
</div>

---

## Overview

The AuthSphere SDK is a zero-dependency TypeScript library that abstracts OpenID Connect (OIDC) and PKCE flows into a unified API. It provides the cryptographic primitives and session management logic needed to integrate AuthSphere with frontend applications.

## Features

- **Automated PKCE**: Automatically generates `code_verifier` strings and SHA-256 `code_challenge` hashes (RFC 7636).
- **Universal Provider Handshaking**: Unified interface for social identity redirects (Google, GitHub, Discord).
- **Session Management**: Manages Access and Refresh token lifecycles with built-in silent renewal.
- **Identity Challenges**: Supports local authentication flows (Email/Password) and OTP verification, preserving authentication context across redirects.

## Installation

```bash
npm install @authspherejs/sdk
```

## Usage

### 1. Initialize

Configure the SDK singleton at your application root.

```typescript
import AuthSphere from "@authspherejs/sdk";

AuthSphere.initAuth({
  publicKey: "YOUR_PROJECT_PUB_KEY",
  projectId: "YOUR_PROJECT_ID",
  redirectUri: window.location.origin + "/callback",
  baseUrl: "https://auth-sphere-6s2v.vercel.app",
});
```

### 2. Initiate Login

```typescript
// Social Login
AuthSphere.redirectToLogin("google");

// Local Login
const onLogin = async (credentials) => {
  try {
    const res = await AuthSphere.loginLocal(credentials);
    if (res?.redirect) window.location.href = res.redirect;
  } catch (err) {
    if (err.message.includes("not verified")) {
      navigate(
        `/verify-otp?email=${credentials.email}&sdk_request=${err.sdk_request}`,
      );
    }
  }
};
```

### 3. Handle Callback

Exchange the authorization code for a session on your callback route.

```tsx
import { useEffect, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import AuthSphere from "@authspherejs/sdk";

const Callback = () => {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const processed = useRef(false);

  useEffect(() => {
    if (processed.current) return;
    processed.current = true;

    if (params.get("error") === "email_not_verified") {
      navigate(
        `/verify-otp?email=${params.get("email")}&sdk_request=${params.get("sdk_request") || ""}`,
      );
      return;
    }

    AuthSphere.handleAuthCallback()
      .then(() => navigate("/dashboard"))
      .catch((err) => console.error("Handshake Failed:", err));
  }, [navigate, params]);

  return <div>Authenticating...</div>;
};
```

### 4. OTP Verification

```tsx
const onVerify = async (otpValue) => {
  const res = await AuthSphere.verifyOTP({
    email,
    otp: otpValue,
    sdk_request: sdkReq,
  });

  if (res?.redirect) {
    window.location.href = res.redirect;
  } else {
    navigate(sdkReq ? "/dashboard" : "/login");
  }
};
```

## API Reference

- `initAuth(config: Config)`: Configures the global client.
- `redirectToLogin(provider: Provider)`: Initiates a redirect to the provider.
- `handleAuthCallback()`: Exchanges the OIDC code for a Session.
- `loginLocal(data: LoginData)`: Authenticates using local credentials.
- `verifyOTP(data: OTPData)`: Resolves an identity challenge.
- `getUser()`: Retrieves the active user profile from storage.
- `isAuthenticated()`: Synchronous check of session state.

## Configuration Options

| Parameter     | Type      | Required | Description                                            |
| ------------- | --------- | -------- | ------------------------------------------------------ |
| `publicKey`   | `string`  | Yes      | Your project's public key from the dashboard.          |
| `projectId`   | `string`  | Yes      | Your project's unique ID.                              |
| `redirectUri` | `string`  | Yes      | URI to redirect back to after authentication.          |
| `baseUrl`     | `string`  | No       | Custom API server URL (Defaults to Production).        |
| `storage`     | `Storage` | No       | Custom persistence layer (Defaults to `localStorage`). |

## Security

The SDK adheres to IETF Best Current Practices (BCP) for browser-based applications:

- Enforces PKCE to prevent authorization code injection.
- Validates state to protect against Cross-Site Request Forgery (CSRF).
- Minimizes token exposure in compliance with strict Content Security Policies (CSP).

---

<div align="center">
  <p>Licensed under the <a href="./LICENSE">MIT License</a>.</p>
</div>
