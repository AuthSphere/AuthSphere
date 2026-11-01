import { z } from "zod";

const objectIdRegex = /^[a-f\d]{24}$/i;

export const sessionIdParamSchema = z.object({
  params: z.object({
    sessionId: z.string().regex(objectIdRegex, "Invalid session ID"),
  }),
});
