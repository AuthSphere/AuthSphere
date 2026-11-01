import { z } from "zod";

const objectIdRegex = /^[a-f\d]{24}$/i;

export const createProjectSchema = z.object({
  body: z.object({
    name: z
      .string()
      .min(2, "Project name must be at least 2 characters")
      .max(100, "Project name too long"),
    redirectUris: z
      .array(z.string().url("Invalid redirect URI"))
      .min(1, "At least one redirect URI is required"),
    providers: z.array(z.string()).min(1, "At least one provider is required"),
  }),
});

export const updateProjectSchema = z.object({
  body: z
    .object({
      name: z.string().min(2).max(100).optional(),
      redirectUris: z.array(z.string().url()).optional(),
      providers: z.array(z.string()).optional(),
      allowedOrigins: z.array(z.string()).optional(),
      logoUrl: z.string().url().optional().or(z.literal("")),
      settings: z.record(z.any()).optional(),
      emailTemplate: z.record(z.any()).optional(),
    })
    .refine((data) => Object.keys(data).length > 0, {
      message: "At least one field must be provided for update",
    }),
  params: z.object({
    projectId: z.string().regex(objectIdRegex, "Invalid project ID"),
  }),
});

export const projectIdParamSchema = z.object({
  params: z.object({
    projectId: z.string().regex(objectIdRegex, "Invalid project ID"),
  }),
});

export const projectUserParamSchema = z.object({
  params: z.object({
    projectId: z.string().regex(objectIdRegex, "Invalid project ID"),
    userId: z.string().regex(objectIdRegex, "Invalid user ID"),
  }),
});

export const addWebhookSchema = z.object({
  body: z.object({
    url: z.string().url("Invalid webhook URL"),
    events: z.array(z.string()).min(1, "At least one event is required"),
  }),
  params: z.object({
    projectId: z.string().regex(objectIdRegex, "Invalid project ID"),
  }),
});

export const webhookParamSchema = z.object({
  params: z.object({
    projectId: z.string().regex(objectIdRegex, "Invalid project ID"),
    webhookId: z.string().regex(objectIdRegex, "Invalid webhook ID"),
  }),
});

export const sendTestEmailSchema = z.object({
  body: z.object({
    email: z.string().email("Invalid email address"),
  }),
  params: z.object({
    projectId: z.string().regex(objectIdRegex, "Invalid project ID"),
  }),
});

export const testWebhookSchema = z.object({
  body: z.object({
    event: z.string().min(1, "Event is required"),
  }),
  params: z.object({
    projectId: z.string().regex(objectIdRegex, "Invalid project ID"),
    webhookId: z.string().regex(objectIdRegex, "Invalid webhook ID"),
  }),
});
