import { z } from "zod";

const objectIdRegex = /^[a-f\d]{24}$/i;

export const notificationIdParamSchema = z.object({
  params: z.object({
    id: z.string().regex(objectIdRegex, "Invalid notification ID"),
  }),
});
