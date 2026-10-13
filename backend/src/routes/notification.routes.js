import { Router } from "express";
import {
  getNotifications,
  markAsRead,
  markAllAsRead,
} from "../controllers/notification.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { validate } from "../middlewares/validate.middleware.js";
import { notificationIdParamSchema } from "../validators/notification.validators.js";

const router = Router();

router.use(verifyJWT);

router.get("/", getNotifications);
router.patch("/read-all", markAllAsRead);
router.patch("/:id/read", validate(notificationIdParamSchema), markAsRead);

export default router;
