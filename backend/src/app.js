import express from "express";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import crypto from "crypto";
import hpp from "hpp";
import morgan from "morgan";

import logger, { stream } from "./utils/logger.js";
import { handleError } from "./utils/AppError.js";
import { globalLimiter } from "./middlewares/rateLimiter.js";
import { conf } from "./configs/env.js";
import { swaggerDocs } from "./configs/swagger.js";
import routes from "./routes/index.js";
import homeHandler from "./home.js";
import connectDB from "./database/connectDB.js";

const app = express();

app.set("trust proxy", 1);

// ── Ensure MongoDB is connected in THIS execution context ─────────────────────
// In Cloudflare Workers, httpServerHandler runs Express in a Node-compat
// thread that is SEPARATE from the Worker isolate where `fetch()` runs.
// A connectDB() call in the Worker fetch handler does NOT share its socket
// with Express/Mongoose queries. We must connect here — inside Express —
// so the connection is alive in the same context as Developer.findOne() etc.
app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (err) {
    logger.error("DB connection failed on request:", { error: err.message });
    res.status(503).json({ success: false, message: "Database unavailable" });
  }
});
// ─────────────────────────────────────────────────────────────────────────────

app.use((req, res, next) => {
  try {
    req.id = crypto.randomUUID?.() || Date.now().toString();
    next();
  } catch (_err) {
    next();
  }
});

// Attach logger to request object (as early as possible)
app.use((req, res, next) => {
  try {
    req.logger =
      typeof logger?.child === "function"
        ? logger.child({ requestId: req.id })
        : logger;
    next();
  } catch (_err) {
    req.logger = logger;
    next();
  }
});

// Use Morgan with Winston stream in Node.js environments only
// Morgan uses `new Function()` which is forbidden in Cloudflare Workers
const isCloudflareWorker =
  typeof caches !== "undefined" || typeof WebSocketPair !== "undefined";

if (!isCloudflareWorker) {
  const morganFormat =
    process.env.NODE_ENV === "production" ? "combined" : "dev";
  app.use(morgan(morganFormat, { stream }));
} else {
  // Simple logger for Cloudflare Workers
  app.use((req, res, next) => {
    const start = Date.now();
    res.on("finish", () => {
      const duration = Date.now() - start;
      logger.info(
        `HTTP ${req.method} ${req.url} ${res.statusCode} - ${duration}ms`,
      );
    });
    next();
  });
}

// --- CORS Configuration ---
// SDK routes (/sdk/*) intentionally bypass the server-level allowlist.
// Each project defines its own allowedOrigins in the DB, which is enforced
// by the sdkCors middleware mounted on the /sdk router itself.
// All other routes use the server allowlist below.

const buildAllowedOrigins = () => {
  const raw = [
    ...(conf.corsOrigin ? conf.corsOrigin.split(",") : []),
    conf.frontendUrl,
    conf.cliUrl,
  ]
    .map((o) => (o || "").trim())
    .filter(Boolean);
  return [...new Set(raw)];
};

// SDK_CORS_BYPASS_RE matches /sdk and any sub-path e.g. /sdk/token
const SDK_PATH_RE = /^\/sdk(\/|$)/;

app.use((req, res, next) => {
  const origin = req.headers.origin;

  // ── SDK routes: skip server allowlist, sdkCors handles it in the router ──
  if (SDK_PATH_RE.test(req.path)) {
    // Still need to set a permissive CORS header for pre-flight so the browser
    // doesn't drop the request before it reaches the /sdk router.
    if (origin) {
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
    }
    // Don't short-circuit OPTIONS here — let sdkCors do the project check
    return next();
  }

  // ── All other routes: enforce the server allowlist ──
  if (!origin) return next(); // server-to-server / curl

  if (conf.corsOrigin === "*" || process.env.NODE_ENV !== "production") {
    res.setHeader("Access-Control-Allow-Origin", origin);
    res.setHeader("Access-Control-Allow-Credentials", "true");
    res.setHeader("Vary", "Origin");
    if (req.method === "OPTIONS") {
      res.setHeader(
        "Access-Control-Allow-Methods",
        "GET,POST,PUT,DELETE,PATCH,OPTIONS",
      );
      res.setHeader(
        "Access-Control-Allow-Headers",
        "Content-Type, Authorization, X-Requested-With",
      );
      return res.sendStatus(204);
    }
    return next();
  }

  const allowedOrigins = buildAllowedOrigins();
  if (allowedOrigins.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
    res.setHeader("Access-Control-Allow-Credentials", "true");
    res.setHeader("Vary", "Origin");
    if (req.method === "OPTIONS") {
      res.setHeader(
        "Access-Control-Allow-Methods",
        "GET,POST,PUT,DELETE,PATCH,OPTIONS",
      );
      res.setHeader(
        "Access-Control-Allow-Headers",
        "Content-Type, Authorization, X-Requested-With",
      );
      return res.sendStatus(204);
    }
    return next();
  }

  logger.warn(
    `CORS blocked origin: "${origin}". Allowed: [${allowedOrigins.join(", ")}]`,
  );
  return res.status(403).json({ success: false, error: "Not allowed by CORS" });
});

// --- Standard Middleware (Parser) ---
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(cookieParser());
app.use(express.static("public"));

// --- Security Middleware ---
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-inline'", "https://cdn.tailwindcss.com"],
        styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
        imgSrc: ["'self'", "data:", "https:"],
        fontSrc: ["'self'", "https://fonts.gstatic.com"],
        connectSrc: ["'self'", "https:"],
      },
    },
  }),
);
// app.use(mongoSanitize()); // Now after body parsers
app.use(hpp());

// --- Global Rate Limiting ---
app.use("/api", globalLimiter);

// --- Swagger Documentation ---
swaggerDocs(app);

// --- Home & Health Check ---
app.get("/", homeHandler);
app.get("/health", (req, res) => {
  const uptime = typeof process.uptime === "function" ? process.uptime() : 0;
  res.status(200).json({
    status: "OK",
    uptime: `${uptime.toFixed(2)}s`,
  });
});

// --- Mount all API routes ---
app.use(routes);

// --- Global Error Handler ---
app.use(handleError);

export default app;
