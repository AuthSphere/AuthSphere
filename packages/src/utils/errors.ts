/** Base authentication error */
export class AuthError extends Error {
  public readonly code: string;
  public readonly statusCode?: number;
  public readonly sdk_request?: string;
  public readonly email?: string;

  constructor(
    message: string,
    code = "AUTH_ERROR",
    statusCode?: number,
    details?: { sdk_request?: string; email?: string },
  ) {
    super(message);
    this.name = "AuthError";
    this.code = code;
    this.statusCode = statusCode;
    if (details?.sdk_request) this.sdk_request = details.sdk_request;
    if (details?.email) this.email = details.email;

    // Fix prototype chain for instanceof
    Object.setPrototypeOf(this, new.target.prototype);
    Object.freeze(this); // optional, prevent mutation
  }
}

/** Configuration error (invalid SDK setup) */
export class ConfigError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ConfigError";
    Object.setPrototypeOf(this, new.target.prototype);
    Object.freeze(this);
  }
}

/** Network / communication error */
export class NetworkError extends AuthError {
  constructor(message: string, statusCode?: number) {
    super(message, "NETWORK_ERROR", statusCode);
    this.name = "NetworkError";
    Object.freeze(this);
  }
}

/** Token expired error */
export class TokenExpiredError extends AuthError {
  constructor() {
    super("Token has expired", "TOKEN_EXPIRED", 401);
    this.name = "TokenExpiredError";
    Object.freeze(this);
  }
}

/** PKCE validation error */
export class PKCEError extends AuthError {
  constructor(message: string) {
    super(message, "PKCE_ERROR", 400);
    this.name = "PKCEError";
    Object.freeze(this);
  }
}

/** State (CSRF) validation error */
export class StateValidationError extends AuthError {
  constructor(message: string) {
    super(message, "STATE_VALIDATION_ERROR", 400);
    this.name = "StateValidationError";
    Object.freeze(this);
  }
}
