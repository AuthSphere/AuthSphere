import { Router } from "express";
import {
  getProjectLogs,
  getGlobalLogs,
} from "../controllers/auditLog.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { validate } from "../middlewares/validate.middleware.js";
import {
  auditLogQuerySchema,
  auditLogProjectParamSchema,
} from "../validators/auditLog.validators.js";

const router = Router();

router.use(verifyJWT);

router.get("/global", validate(auditLogQuerySchema), getGlobalLogs);
router.get(
  "/project/:projectId",
  validate(auditLogProjectParamSchema),
  getProjectLogs,
);

export default router;
