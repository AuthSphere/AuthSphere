import type { AuthConfig } from "../types";

const DEFAULT_BASE_URL = "http://localhost:8000";

let config: AuthConfig | null = null;

/** Initialize SDK with required config */
export function initAuth(options: AuthConfig): void {
  if (!options.publicKey) throw new Error("publicKey is required");
  if (!options.projectId) throw new Error("projectId is required");
  if (!options.redirectUri) throw new Error("redirectUri is required");

  // Validate URL format
  try {
    new URL(options.redirectUri);
  } catch {
    throw new Error("redirectUri must be a valid URL");
  }

  if (!options.baseUrl) options.baseUrl = DEFAULT_BASE_URL;

  config = {
    publicKey: options.publicKey,
    projectId: options.projectId,
    redirectUri: options.redirectUri,
    baseUrl: options.baseUrl,
    onTokenRefresh: options.onTokenRefresh,
    onAuthError: options.onAuthError,
  };
}

/** Get current SDK configuration */
export function getConfig(): AuthConfig {
  if (!config) {
    throw new Error("AuthSphere not initialized. Call initAuth() first.");
  }
  return Object.freeze(config); // prevent mutation
}

/** Check if SDK has been initialized */
export function isInitialized(): boolean {
  return config !== null;
}
