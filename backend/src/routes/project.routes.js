import { Router } from "express";
import {
  createProject,
  getProjects,
  getProject,
  updateProject,
  deleteProject,
  rotateKeys,
  getProjectUsers,
  deleteProjectUser,
  toggleUserVerification,
  toggleUserBlock,
  getConfiguredProviders,
  sendTestEmail,
  addWebhook,
  deleteWebhook,
  testWebhook,
} from "../controllers/project.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { validate } from "../middlewares/validate.middleware.js";
import {
  createProjectSchema,
  updateProjectSchema,
  projectIdParamSchema,
  projectUserParamSchema,
  addWebhookSchema,
  webhookParamSchema,
  sendTestEmailSchema,
  testWebhookSchema,
} from "../validators/project.validators.js";

const router = Router();

// Protect all project routes
router.use(verifyJWT);

// Create project
router.post("/", validate(createProjectSchema), createProject);

// Get all projects for logged-in developer
router.get("/", getProjects);

// Get single project (with ID validation)
router.get("/:projectId", validate(projectIdParamSchema), getProject);

// Update project (PATCH = partial update)
router.patch("/:projectId", validate(updateProjectSchema), updateProject);

// Rotate project keys
router.post(
  "/:projectId/rotate-keys",
  validate(projectIdParamSchema),
  rotateKeys,
);

// Get project users
router.get(
  "/:projectId/users",
  validate(projectIdParamSchema),
  getProjectUsers,
);

// Delete project user
router.delete(
  "/:projectId/users/:userId",
  validate(projectUserParamSchema),
  deleteProjectUser,
);

// Toggle user verification
router.patch(
  "/:projectId/users/:userId/verify",
  validate(projectUserParamSchema),
  toggleUserVerification,
);

// Toggle user block status
router.patch(
  "/:projectId/users/:userId/block",
  validate(projectUserParamSchema),
  toggleUserBlock,
);

// Get backend provider configuration
router.get(
  "/:projectId/providers-config",
  validate(projectIdParamSchema),
  getConfiguredProviders,
);

// Send test email
router.post(
  "/:projectId/send-test-email",
  validate(sendTestEmailSchema),
  sendTestEmail,
);

// Webhook routes
router.post("/:projectId/webhooks", validate(addWebhookSchema), addWebhook);
router.delete(
  "/:projectId/webhooks/:webhookId",
  validate(webhookParamSchema),
  deleteWebhook,
);
router.post(
  "/:projectId/webhooks/:webhookId/test",
  validate(testWebhookSchema),
  testWebhook,
);

// Delete project
router.delete("/:projectId", validate(projectIdParamSchema), deleteProject);

export default router;
