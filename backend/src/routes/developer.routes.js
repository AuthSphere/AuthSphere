import { Router } from "express";
import {
  registerDeveloper,
  loginDeveloper,
  logoutDeveloper,
  refreshAccessToken,
  getCurrentDeveloper,
  getDashboardStats,
  updateDeveloperProfile,
  deleteDeveloperAccount,
  updateDeveloperPreferences,
  updateDeveloperOrganization,
  getDeveloperSettings,
} from "../controllers/developer.controller.js";
import { authLimiter } from "../middlewares/rateLimiter.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { validate } from "../middlewares/validate.middleware.js";
import {
  developerRegisterSchema,
  developerLoginSchema,
  updateProfileSchema,
  updateOrganizationSchema,
  updatePreferencesSchema,
} from "../validators/developer.validators.js";

const router = Router();

router
  .route("/register")
  .post(authLimiter, validate(developerRegisterSchema), registerDeveloper);
router
  .route("/login")
  .post(authLimiter, validate(developerLoginSchema), loginDeveloper);
router.route("/refresh-token").post(refreshAccessToken);

router.route("/logout").post(verifyJWT, logoutDeveloper);
router.route("/me").get(verifyJWT, getCurrentDeveloper);
router.route("/stats").get(verifyJWT, getDashboardStats);

router
  .route("/profile")
  .put(verifyJWT, validate(updateProfileSchema), updateDeveloperProfile);
router.route("/account").delete(verifyJWT, deleteDeveloperAccount);

// New Settings Routes
router.route("/settings").get(verifyJWT, getDeveloperSettings);
router
  .route("/preferences")
  .put(
    verifyJWT,
    validate(updatePreferencesSchema),
    updateDeveloperPreferences,
  );
router
  .route("/organization")
  .put(
    verifyJWT,
    validate(updateOrganizationSchema),
    updateDeveloperOrganization,
  );

export default router;
