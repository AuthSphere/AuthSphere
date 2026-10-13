/**
 * Dynamic SDK CORS Middleware
 *
 * For SDK routes, the global CORS allowlist (your server's own frontend)
 * is irrelevant. Each project registers its own `allowedOrigins` in the DB.
 * This middleware:
 *   1. Extracts the public_key from the request (body, query-string, or header).
 *   2. Looks up the project's allowedOrigins from the DB.
 *   3. If the requesting origin is in that list → sets CORS headers and passes.
 *   4. If allowedOrigins is empty/not set → falls back to allowing all origins
 *      (permissive default so developers don't get blocked during setup).
 *   5. If allowedOrigins is set and the origin is NOT in the list → 403.
 *
 * The pre-flight OPTIONS short-circuit means browsers never see a 500 from
 * the global CORS handler.
 */

import Project from "../models/project.model.js";
import logger from "../utils/logger.js";

// Cache project origins briefly to avoid a DB hit on every pre-flight.
// Key: publicKey, Value: { origins: string[], fetchedAt: number }
const _cache = new Map();
const CACHE_TTL_MS = 60_000; // 60 seconds

async function resolveAllowedOrigins(publicKey) {
  if (!publicKey) return null; // null = "no project found, allow all"

  const cached = _cache.get(publicKey);
  if (cached && Date.now() - cached.fetchedAt < CACHE_TTL_MS) {
    return cached.origins;
  }

  try {
    const project = await Project.findOne(
      { publicKey, status: "active" },
      { allowedOrigins: 1 },
    ).lean();

    if (!project) return null;

    const origins = (project.allowedOrigins || [])
      .map((o) => o.trim())
      .filter(Boolean);
    _cache.set(publicKey, { origins, fetchedAt: Date.now() });
    return origins;
  } catch (err) {
    logger.error(
      "[sdkCors] DB lookup failed, denying all origins:",
      err.message,
    );
    return []; // fail-closed: deny all origins on DB error
  }
}

/**
 * Extract the public key from wherever the SDK might send it.
 * Supports: body (public_key / publicKey), query string, or
 * a custom X-Public-Key header.
 */
function extractPublicKey(req) {
  return (
    req.body?.public_key ||
    req.body?.publicKey ||
    req.query?.public_key ||
    req.headers?.["x-public-key"] ||
    null
  );
}

/**
 * Returns an Express middleware that handles CORS for a single SDK request
 * by dynamically looking up the project's allowedOrigins.
 */
export function sdkCors() {
  return async function sdkCorsMiddleware(req, res, next) {
    const origin = req.headers.origin;

    // No origin header = server-to-server / Postman / CLI — skip CORS entirely
    if (!origin) return next();

    const publicKey = extractPublicKey(req);
    const allowedOrigins = await resolveAllowedOrigins(publicKey);

    // No project found OR project has no allowedOrigins configured →
    // fall back to the global CORS handler (permissive for dev setups).
    if (!allowedOrigins || allowedOrigins.length === 0) {
      return next();
    }

    const originAllowed = allowedOrigins.includes(origin);

    if (!originAllowed) {
      logger.warn(
        `[sdkCors] Blocked origin "${origin}" for key "${publicKey}". ` +
          `Allowed: [${allowedOrigins.join(", ")}]`,
      );

      // Respond to pre-flight and regular requests with 403
      res.setHeader("Vary", "Origin");
      return res.status(403).json({
        success: false,
        error: "cors_blocked",
        message:
          `Origin "${origin}" is not allowed for this project. ` +
          `Add it to your project's Allowed Origins in the AuthSphere dashboard.`,
      });
    }

    // Origin is allowed — set CORS headers manually for this request so the
    // global cors() middleware doesn't need to touch SDK routes at all.
    res.setHeader("Access-Control-Allow-Origin", origin);
    res.setHeader("Access-Control-Allow-Credentials", "true");
    res.setHeader(
      "Access-Control-Allow-Methods",
      "GET,POST,PUT,DELETE,PATCH,OPTIONS",
    );
    res.setHeader(
      "Access-Control-Allow-Headers",
      "Content-Type, Authorization, X-Requested-With, X-Public-Key",
    );
    res.setHeader("Vary", "Origin");

    // Short-circuit pre-flight
    if (req.method === "OPTIONS") {
      return res.sendStatus(204);
    }

    return next();
  };
}

/**
 * Invalidate the in-process cache for a given public key.
 * Call this after a developer updates their project's allowedOrigins.
 */
export function invalidateSdkCorsCache(publicKey) {
  if (publicKey) _cache.delete(publicKey);
}
