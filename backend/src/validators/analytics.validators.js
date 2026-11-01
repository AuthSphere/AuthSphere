import { z } from "zod";

const objectIdRegex = /^[a-f\d]{24}$/i;

export const analyticsParamSchema = z.object({
  params: z.object({
    projectId: z.string().regex(objectIdRegex, "Invalid project ID"),
  }),
});
