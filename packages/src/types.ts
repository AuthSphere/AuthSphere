// package/src/types.ts

export type Provider = "google" | "github" | "discord";

export interface AuthConfig {
  publicKey: string;
  projectId: string;
  redirectUri: string;
  baseUrl?: string;
  onTokenRefresh?: (tokens: AuthTokens) => void;
  onAuthError?: (error: Error) => void;
}

export interface AuthUser {
  readonly id: string;
  readonly email: string;
  readonly username: string;
  readonly picture?: string;
  readonly provider: Provider;
}

export interface AuthTokens {
  readonly accessToken: string;
  readonly refreshToken: string;
  readonly expiresAt: number; // or Date if you prefer
}

export interface AuthResponse {
  expiresAt: number;
  success: boolean;
  user: AuthUser;
  accessToken: string;
  refreshToken: string;
  metadata?: Record<string, unknown>; // optional future-proof
}

export interface TokenExchangeRequest {
  code: string;
  publicKey: string;
  redirectUri: string;
  codeVerifier: string;
}

export interface RefreshTokenRequest {
  refreshToken: string;
  publicKey: string;
}
