import { Router } from "express";
import {
  getAnalyticsOverview,
  getAnalyticsCharts,
  getRecentActivity,
} from "../controllers/analytics.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { trackSessionActivity } from "../middlewares/sessionTracker.js";
import { validate } from "../middlewares/validate.middleware.js";
import { analyticsParamSchema } from "../validators/analytics.validators.js";

const router = Router();

// All analytics routes require authentication
router.use(verifyJWT);
router.use(trackSessionActivity);

router.get(
  "/:projectId/overview",
  validate(analyticsParamSchema),
  getAnalyticsOverview,
);
router.get(
  "/:projectId/charts",
  validate(analyticsParamSchema),
  getAnalyticsCharts,
);
router.get(
  "/:projectId/recent-activity",
  validate(analyticsParamSchema),
  getRecentActivity,
);

export default router;
