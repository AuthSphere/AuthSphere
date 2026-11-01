// package/src/index.ts

import { handleAuthCallback } from "./client/callback";
import { redirectToLogin } from "./client/redirect";
import { initAuth } from "./config/options";
import {
  getToken,
  getUser,
  isAuthenticated,
  logout,
  ensureAuthenticated,
} from "./client/session";
import { fetchWithAuth } from "./client/api";
import { AuthError } from "./utils/errors";
import {
  register,
  loginLocal,
  verifyOTP,
  resendVerification,
} from "./client/local";
import {
  getProjectUsers,
  deleteProjectUser,
  toggleUserVerification,
} from "./client/management";

// =======================
// Config
// =======================
export { initAuth } from "./config/options";

// =======================
// Auth Flow
// =======================
export { redirectToLogin } from "./client/redirect";
export { handleAuthCallback } from "./client/callback";
export {
  register,
  loginLocal,
  verifyOTP,
  resendVerification,
} from "./client/local";
export {
  getProjectUsers,
  deleteProjectUser,
  toggleUserVerification,
} from "./client/management";

// =======================
// Session
// =======================
export {
  getUser,
  isAuthenticated,
  logout,
  getToken,
  ensureAuthenticated,
} from "./client/session";

// =======================
// API
// =======================
export { fetchWithAuth } from "./client/api";

// =======================
// Errors
// =======================
export { AuthError } from "./utils/errors";

// =======================
// Types
// =======================
export type { AuthConfig, AuthUser, AuthTokens, Provider } from "./types";

// =======================
// Default Export (DX Friendly)
// =======================
const AuthSphere = {
  initAuth,
  redirectToLogin,
  handleAuthCallback,
  getUser,
  isAuthenticated,
  logout,
  getToken,
  ensureAuthenticated,
  fetchWithAuth,
  AuthError,
  register,
  loginLocal,
  verifyOTP,
  resendVerification,
  getProjectUsers,
  deleteProjectUser,
  toggleUserVerification,
};

// =======================
// React
// =======================
export * from "./react";

export default AuthSphere;
