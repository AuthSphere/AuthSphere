import { z } from "zod";

export const sdkAuthorizeSchema = z.object({
  query: z.object({
    public_key: z.string({ required_error: "public_key is required" }),
    project_id: z.string({ required_error: "project_id is required" }),
    redirect_uri: z
      .string({ required_error: "redirect_uri is required" })
      .url("Invalid redirect_uri format"),
    provider: z.string({ required_error: "provider is required" }),
    response_type: z.literal("code", {
      required_error: "response_type must be 'code'",
    }),
    code_challenge: z.string({ required_error: "code_challenge is required" }),
    code_challenge_method: z.literal("S256", {
      required_error: "code_challenge_method must be 'S256'",
    }),
    state: z.string({ required_error: "state is required" }),
  }),
});

export const sdkTokenSchema = z.object({
  body: z
    .object({
      code: z.string({ required_error: "code is required" }),
      public_key: z.string().optional(),
      client_id: z.string().optional(),
      code_verifier: z.string().optional(), // Made optional in schema but logic enforces it if challenge exists
      redirect_uri: z.string().optional(),
    })
    .refine((data) => data.public_key || data.client_id, {
      message: "Either public_key or client_id is required",
      path: ["public_key"],
    }),
});

export const sdkRefreshSchema = z.object({
  body: z.object({
    refreshToken: z.string({ required_error: "refreshToken is required" }),
    publicKey: z.string().optional(),
  }),
});

export const sdkRegisterLocalSchema = z.object({
  body: z
    .object({
      email: z
        .string()
        .trim()
        .toLowerCase()
        .min(3, "Invalid email")
        .refine((e) => e.includes("@"), "Invalid email address"),
      password: z.string().min(6, "Password must be at least 6 characters"),
      username: z.string().min(2, "Username is too short"),
      public_key: z.string().optional(),
      publicKey: z.string().optional(),
      projectId: z.string({ required_error: "projectId is required" }),
      sdk_request: z.string().nullable().optional(),
    })
    .refine((data) => data.public_key || data.publicKey, {
      message: "Public key is required",
      path: ["public_key"],
    }),
});

export const sdkLoginLocalSchema = z.object({
  body: z
    .object({
      email: z
        .string()
        .trim()
        .toLowerCase()
        .min(3, "Invalid email")
        .refine((e) => e.includes("@"), "Invalid email address"),
      password: z.string().min(1, "Password is required"),
      public_key: z.string().optional(),
      publicKey: z.string().optional(),
      projectId: z.string({ required_error: "projectId is required" }),
      sdk_request: z.string({
        required_error: "sdk_request (requestId) is required for login flow",
      }),
    })
    .refine((data) => data.public_key || data.publicKey, {
      message: "Public key is required",
      path: ["public_key"],
    }),
});
