import express from "express";
import {
  authorize,
  token,
  refresh,
  registerLocal,
  loginLocal,
  verifyOTP,
  resendVerification,
} from "../controllers/sdk.controller.js";

import { authLimiter } from "../middlewares/rateLimiter.js";
import { validate } from "../middlewares/validate.middleware.js";
import {
  sdkAuthorizeSchema,
  sdkTokenSchema,
  sdkRefreshSchema,
  sdkRegisterLocalSchema,
  sdkLoginLocalSchema,
} from "../validators/sdk.validators.js";
import { sdkCors } from "../middlewares/sdkCors.middleware.js";

const router = express.Router();

// Apply dynamic per-project CORS to every SDK route.
// This runs before any controller and handles pre-flight OPTIONS automatically.
router.use(sdkCors());

/**
 * ============================================================
 * SDK ROUTES
 * Base path: /sdk
 * ============================================================
 */

/**
 * Initiate OAuth flow (browser redirect)
 * GET /sdk/authorize
 */
router.get("/authorize", validate(sdkAuthorizeSchema), authorize);

/**
 * Exchange authorization code for tokens
 * POST /sdk/token
 */
router.post("/token", validate(sdkTokenSchema), token);

/**
 * Refresh access token using refresh token
 * POST /sdk/refresh
 */
router.post("/refresh", validate(sdkRefreshSchema), refresh);
router.post(
  "/register",
  authLimiter,
  validate(sdkRegisterLocalSchema),
  registerLocal,
);
router.post(
  "/login-local",
  authLimiter,
  validate(sdkLoginLocalSchema),
  loginLocal,
);
router.post("/verify-otp", verifyOTP);
router.post("/resend-verification", resendVerification);

export default router;
