import rateLimit from "express-rate-limit";
import { AppError } from "../utils/AppError.js";

/**
 * General rate limiter for all API requests
 */
export const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per window
  message: "Too many requests from this IP, please try again after 15 minutes",
  handler: (req, res, next, options) => {
    next(new AppError(options.message, 429));
  },
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  validate: { trustProxy: false },
});

/**
 * Stricter rate limiter for auth-related endpoints (Login, Register, OTP)
 */
export const authLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 20, // Limit each IP to 20 attempts per hour
  message: "Too many authentication attempts, please try again after an hour",
  handler: (req, res, next, options) => {
    next(new AppError(options.message, 429));
  },
  standardHeaders: true,
  legacyHeaders: false,
  validate: { trustProxy: false },
});
