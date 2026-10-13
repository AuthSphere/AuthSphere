import { z } from "zod";

const objectIdRegex = /^[a-f\d]{24}$/i;

export const auditLogQuerySchema = z.object({
  query: z.object({
    category: z.string().optional(),
    actorType: z.string().optional(),
  }),
});

export const auditLogProjectParamSchema = z.object({
  params: z.object({
    projectId: z.string().regex(objectIdRegex, "Invalid project ID"),
  }),
  query: z.object({
    category: z.string().optional(),
    actorType: z.string().optional(),
  }),
});
