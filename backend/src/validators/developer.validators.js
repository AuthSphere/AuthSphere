import { z } from "zod";

export const developerRegisterSchema = z.object({
  body: z.object({
    username: z.string().min(3, "Username must be at least 3 characters long"),
    email: z.string().email("Invalid email format"),
    password: z.string().min(6, "Password must be at least 6 characters long"),
  }),
});

export const developerLoginSchema = z.object({
  body: z.object({
    email: z.string().email("Invalid email format"),
    password: z.string().min(1, "Password is required"),
  }),
});

export const updateProfileSchema = z.object({
  body: z.object({
    username: z
      .string()
      .min(3, "Username must be at least 3 characters long")
      .optional(),
  }),
});

export const updateOrganizationSchema = z.object({
  body: z.object({
    organization: z.string().optional(),
    website: z.string().url("Invalid URL").optional().or(z.literal("")),
    bio: z.string().max(500, "Bio exceeds 500 characters").optional(),
  }),
});

export const updatePreferencesSchema = z.object({
  body: z.object({
    preferences: z.object({
      notifications: z
        .object({
          email: z
            .object({
              projectUpdates: z.boolean().optional(),
              securityAlerts: z.boolean().optional(),
              weeklyDigest: z.boolean().optional(),
              newUserSignups: z.boolean().optional(),
            })
            .optional(),
          inApp: z
            .object({
              enabled: z.boolean().optional(),
              sound: z.boolean().optional(),
            })
            .optional(),
        })
        .optional(),
      api: z
        .object({
          defaultRateLimit: z
            .number()
            .min(0, "Rate limit must be positive")
            .optional(),
          enableCors: z.boolean().optional(),
          allowedIPs: z
            .array(
              z
                .string()
                .regex(
                  /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/,
                  "Invalid IP address",
                ),
            )
            .optional(),
        })
        .optional(),
      dashboard: z
        .object({
          defaultView: z.enum(["grid", "list"]).optional(),
          itemsPerPage: z.number().min(1).max(100).optional(),
          showAnalytics: z.boolean().optional(),
        })
        .optional(),
    }),
  }),
});
