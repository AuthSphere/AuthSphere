import { z } from "zod";

export const exchangeSessionSchema = z.object({
  params: z.object({
    token: z.string().min(1, "Token is required"),
  }),
});
