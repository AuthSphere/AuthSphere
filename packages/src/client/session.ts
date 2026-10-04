import {
  getUser as getUserFromStorage,
  getAccessToken,
  getRefreshToken,
  clearAll,
  isTokenExpired,
} from "../utils/storage";
import { refreshTokens } from "./refresh";
import { getConfig } from "../config/options";
import type { AuthUser } from "../types";

/** Get current user from storage */
export function getUser(): AuthUser | null {
  return getUserFromStorage();
}

/** Get current access token from storage (may be expired) */
export function getToken(): string | null {
  return getAccessToken();
}

/** Check if user is authenticated and token is valid */
export function isAuthenticated(): boolean {
  const token = getAccessToken();
  if (!token) return false;
  if (isTokenExpired()) return false;
  return true;
}

/** Ensure valid token and refresh if needed */
export async function ensureAuthenticated(): Promise<boolean> {
  if (isAuthenticated()) return true;

  const refreshToken = getRefreshToken();
  if (!refreshToken) return false;

  try {
    await refreshTokens();
    return true;
  } catch (err) {
    clearAll();
    console.error("Failed to refresh token:", err);
    return false;
  }
}

/** Logout user, clear storage, optional backend logout */
export async function logout(): Promise<void> {
  clearAll();

  const { baseUrl } = getConfig();
  if (!baseUrl) return;

  try {
    await fetch(`${baseUrl.replace(/\/$/, "")}/sdk/logout`, {
      method: "POST",
      credentials: "include", // optional depending on backend
    });
  } catch {
    // ignore errors, user session is cleared locally
  }
}

/** Get valid token, ensuring refresh if needed */
export async function getValidToken(): Promise<string | null> {
  const valid = await ensureAuthenticated();
  return valid ? getAccessToken() : null;
}
