import { Router } from "express";
import {
  getDeveloperSessions,
  revokeSession,
  revokeAllOtherSessions,
  revokeAllSessions,
} from "../controllers/session.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { trackSessionActivity } from "../middlewares/sessionTracker.js";
import { validate } from "../middlewares/validate.middleware.js";
import { sessionIdParamSchema } from "../validators/session.validators.js";

const router = Router();

router.use(verifyJWT);
router.use(trackSessionActivity);

router.get("/", getDeveloperSessions);
router.delete("/:sessionId", validate(sessionIdParamSchema), revokeSession);
router.post("/revoke-others", revokeAllOtherSessions);
router.post("/revoke-all", revokeAllSessions);

export default router;
