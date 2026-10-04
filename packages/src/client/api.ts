// package/src/client/api.ts
import { getAccessToken, isTokenExpired } from "../utils/storage";
import { refreshTokens } from "./refresh";
import { AuthError } from "../utils/errors";

/**
 * Fetch wrapper that automatically handles authentication
 */
export async function fetchWithAuth(
  url: string,
  options: RequestInit = {},
): Promise<Response> {
  const attemptFetch = async (token: string): Promise<Response> => {
    const headers = new Headers({
      ...(options.headers instanceof Headers
        ? Object.fromEntries(options.headers.entries())
        : options.headers),
      Authorization: `Bearer ${token}`,
    });

    return fetch(url, { ...options, headers });
  };

  // Refresh token if expired
  if (isTokenExpired()) {
    try {
      await refreshTokens();
    } catch {
      throw new AuthError("Session expired. Please log in again.");
    }
  }

  let token = getAccessToken();
  if (!token) throw new AuthError("Not authenticated");

  let response: Response;
  try {
    response = await attemptFetch(token);
  } catch (err) {
    throw new AuthError(
      "Network error. Please try again: " + (err as Error).message,
    );
  }

  // Retry once on 401
  if (response.status === 401) {
    try {
      await refreshTokens();
      token = getAccessToken();
      if (!token) throw new AuthError("Session expired. Please log in again.");
      response = await attemptFetch(token);
    } catch {
      throw new AuthError("Session expired. Please log in again.");
    }
  }

  return response;
}
