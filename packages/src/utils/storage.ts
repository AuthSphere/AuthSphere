import type { AuthUser } from "../types";

const STORAGE_PREFIX = "authsphere_";

const KEYS = {
  ACCESS_TOKEN: `${STORAGE_PREFIX}access_token`,
  REFRESH_TOKEN: `${STORAGE_PREFIX}refresh_token`,
  USER: `${STORAGE_PREFIX}user`,
  EXPIRES_AT: `${STORAGE_PREFIX}expires_at`,
  CODE_VERIFIER: `${STORAGE_PREFIX}code_verifier`,
  STATE: `${STORAGE_PREFIX}state`,
} as const;

const isBrowser = typeof window !== "undefined";
const tokenStorage = isBrowser ? sessionStorage : null;
const dataStorage = isBrowser ? localStorage : null;

/** Storage helpers */
function setItem(storage: Storage | null, key: string, value: string) {
  storage?.setItem(key, value);
}

function getItem(storage: Storage | null, key: string): string | null {
  return storage?.getItem(key) || null;
}

function removeItem(storage: Storage | null, key: string) {
  storage?.removeItem(key);
}

/** Tokens */
export function setAccessToken(token: string) {
  setItem(tokenStorage, KEYS.ACCESS_TOKEN, token);
}

export function getAccessToken(): string | null {
  return getItem(tokenStorage, KEYS.ACCESS_TOKEN);
}

export function setRefreshToken(token: string) {
  setItem(tokenStorage, KEYS.REFRESH_TOKEN, token);
}

export function getRefreshToken(): string | null {
  return getItem(tokenStorage, KEYS.REFRESH_TOKEN);
}

/** User */
export function setUser(user: AuthUser) {
  setItem(dataStorage, KEYS.USER, JSON.stringify(user));
}

export function getUser(): AuthUser | null {
  const raw = getItem(dataStorage, KEYS.USER);
  return raw ? (JSON.parse(raw) as AuthUser) : null;
}

/** Expiry */
export function setExpiresAt(expiresAt: number) {
  setItem(tokenStorage, KEYS.EXPIRES_AT, expiresAt.toString());
}

export function getExpiresAt(): number | null {
  const raw = getItem(tokenStorage, KEYS.EXPIRES_AT);
  return raw ? parseInt(raw, 10) : null;
}

export function isTokenExpired(): boolean {
  const expiresAt = getExpiresAt();
  if (!expiresAt) return true;
  return Date.now() >= expiresAt - 5000; // 5-sec buffer
}

/** PKCE */
export function setCodeVerifier(verifier: string) {
  setItem(dataStorage, KEYS.CODE_VERIFIER, verifier);
}

export function getCodeVerifier(): string | null {
  return getItem(dataStorage, KEYS.CODE_VERIFIER);
}

export function clearCodeVerifier() {
  removeItem(dataStorage, KEYS.CODE_VERIFIER);
}

/** CSRF state */
export function setState(state: string) {
  setItem(dataStorage, KEYS.STATE, state);
}

export function getState(): string | null {
  return getItem(dataStorage, KEYS.STATE);
}

export function clearState() {
  removeItem(dataStorage, KEYS.STATE);
}

/** Clear everything */
export function clearAll() {
  Object.values(KEYS).forEach((key) => {
    removeItem(tokenStorage, key);
    removeItem(dataStorage, key);
  });
}
