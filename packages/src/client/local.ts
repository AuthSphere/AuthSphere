import { getConfig } from "../config/options";
import { AuthError } from "../utils/errors";
import {
  generateCodeVerifier,
  generateCodeChallenge,
  generateState,
} from "../utils/pkce";
import { setCodeVerifier, setState } from "../utils/storage";

/**
 * Register a user locally using email and password.
 */
export async function register(params: {
  email: string;
  password: string;
  username: string;
  sdk_request?: string;
}) {
  const options = getConfig();

  const response = await fetch(`${options.baseUrl}/sdk/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      ...params,
      public_key: options.publicKey,
      projectId: options.projectId,
    }),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new AuthError(data.message || "Registration failed");
  }

  return data;
}

/**
 * Login a user locally using email and password.
 */
export async function loginLocal(params: { email: string; password: string }) {
  const options = getConfig();

  // 1. Generate real PKCE state/verifier and STORE them
  const state = generateState();
  const codeVerifier = generateCodeVerifier();
  const codeChallenge = await generateCodeChallenge(codeVerifier);

  setState(state);
  setCodeVerifier(codeVerifier);

  const authUrl = new URL(`${options.baseUrl}/sdk/authorize`);
  authUrl.searchParams.set("public_key", options.publicKey);
  authUrl.searchParams.set("project_id", options.projectId);
  authUrl.searchParams.set("redirect_uri", options.redirectUri);
  authUrl.searchParams.set("provider", "local");
  authUrl.searchParams.set("response_type", "code");
  authUrl.searchParams.set("code_challenge", codeChallenge);
  authUrl.searchParams.set("code_challenge_method", "S256");
  authUrl.searchParams.set("state", state);
  authUrl.searchParams.set("json", "true");

  const authResponse = await fetch(authUrl.toString(), {
    headers: { Accept: "application/json" },
  });

  if (!authResponse.ok) {
    const errorData = await authResponse.json();
    throw new AuthError(
      errorData.error_description || "Auth initiation failed",
    );
  }

  const authJson = await authResponse.json();
  // Backend wraps as {success, message, data: {requestId}} — unwrap if needed
  const { requestId } = authJson.data || authJson;

  // 2. Perform the actual login
  const loginResponse = await fetch(`${options.baseUrl}/sdk/login-local`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      ...params,
      public_key: options.publicKey,
      projectId: options.projectId,
      sdk_request: requestId,
    }),
  });

  const data = await loginResponse.json();

  if (!loginResponse.ok) {
    // If not verified, the backend returns 403 with sdk_request
    if (
      loginResponse.status === 403 &&
      data.error_code === "EMAIL_NOT_VERIFIED"
    ) {
      throw new AuthError(data.message, "EMAIL_NOT_VERIFIED", 403, {
        sdk_request: data.sdk_request,
        email: params.email,
      });
    }
    throw new AuthError(data.message || "Login failed");
  }

  return data;
}

/**
 * Verify email using OTP.
 */
export async function verifyOTP(params: {
  email: string;
  otp: string;
  sdk_request?: string;
}) {
  const options = getConfig();
  const response = await fetch(`${options.baseUrl}/sdk/verify-otp`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      ...params,
      public_key: options.publicKey,
    }),
  });

  // If successful and sdk_request was provided, backend redirects in handleSDKCallback.
  // We need to handle that redirect if the fetch follows it, or check the final URL.
  // If it's a browser redirect
  if (response.redirected) {
    window.location.href = response.url;
    return;
  }

  const data = await response.json();

  // If it's a JSON redirect (standard in AuthSphere new API)
  // If it's a JSON redirect (standard in AuthSphere new API)
  if (data.redirect) {
    return data;
  }

  if (!response.ok) {
    throw new AuthError(data.message || "Verification failed");
  }

  return data;
}

/**
 * Resend verification OTP.
 */
export async function resendVerification(email: string) {
  const options = getConfig();
  const response = await fetch(`${options.baseUrl}/sdk/resend-verification`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email,
      public_key: options.publicKey,
    }),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new AuthError(data.message || "Failed to resend verification OTP");
  }

  return data;
}
