import winston from "winston";
import chalk from "chalk";
import fs from "fs";
import path from "path";

const isProduction = process.env.NODE_ENV === "production";
const isCloudflareWorker =
  typeof caches !== "undefined" || typeof WebSocketPair !== "undefined";

let logger;

if (isCloudflareWorker) {
  // Minimalistic logger for Cloudflare Workers to avoid verbose stream logs
  const formatMeta = (meta) =>
    meta && Object.keys(meta).length > 0 ? JSON.stringify(meta) : "";
  logger = {
    info: (msg, meta) => console.log(`ℹ️ [INFO] ${msg} ${formatMeta(meta)}`),
    warn: (msg, meta) => console.warn(`⚠️ [WARN] ${msg} ${formatMeta(meta)}`),
    error: (msg, meta) =>
      console.error(`❌ [ERROR] ${msg} ${formatMeta(meta)}`),
    debug: (msg, meta) =>
      console.debug(`🐛 [DEBUG] ${msg} ${formatMeta(meta)}`),
  };
} else {
  // Define the base format
  const baseFormat = winston.format.combine(
    winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    winston.format.json(),
  );

  const transports = [
    new winston.transports.Console({
      format: isProduction
        ? baseFormat
        : winston.format.combine(
            winston.format.timestamp({ format: "HH:mm:ss" }),
            winston.format.colorize(),
            winston.format.printf(({ level, message, timestamp, ...meta }) => {
              let metaStr = "";
              if (Object.keys(meta).length > 0) {
                metaStr = JSON.stringify(meta, null, 2);
              }
              if (typeof message === "string" && message.includes("HTTP/")) {
                return `${chalk.gray(timestamp)} ${message}`;
              }
              return `${chalk.gray(timestamp)} ${level}: ${message} ${
                metaStr ? "\n" + chalk.gray(metaStr) : ""
              }`;
            }),
          ),
    }),
  ];

  if (!isProduction) {
    const logDir = "logs";
    if (!fs.existsSync(logDir)) {
      try {
        fs.mkdirSync(logDir);
      } catch (err) {
        console.error("Failed to create logs directory:", err);
      }
    }

    transports.push(
      new winston.transports.File({
        filename: path.join(logDir, "error.log"),
        level: "error",
        handleExceptions: true,
        maxsize: 5242880, // 5MB
        maxFiles: 5,
      }),
      new winston.transports.File({
        filename: path.join(logDir, "combined.log"),
        maxsize: 5242880, // 5MB
        maxFiles: 5,
      }),
    );
  }

  logger = winston.createLogger({
    level: process.env.LOG_LEVEL || "info",
    format: baseFormat,
    transports,
  });
}

// Create a stream object with a 'write' function that will be used by `morgan`
export const stream = {
  write: (message) => {
    logger.info(message.trim());
  },
};

export default logger;
