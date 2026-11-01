import winston from "winston";
import chalk from "chalk";
import fs from "fs";
import path from "path";

// Check if we are in a production/serverless environment
const isProduction = process.env.NODE_ENV === "production";

// Define the base format
const baseFormat = winston.format.combine(
  winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
  winston.format.json(),
);

// Define transports
const transports = [];

// Always add Console transport for cloud logging visibility
transports.push(
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

            // Special handling for HTTP requests logged via Morgan/stream
            if (typeof message === "string" && message.includes("HTTP/")) {
              return `${chalk.gray(timestamp)} ${message}`;
            }

            return `${chalk.gray(timestamp)} ${level}: ${message} ${
              metaStr ? "\n" + chalk.gray(metaStr) : ""
            }`;
          }),
        ),
  }),
);

// Only add File transports in non-production environments
if (!isProduction) {
  const logDir = "logs";
  // Ensure log directory exists locally
  if (!fs.existsSync(logDir)) {
    try {
      fs.mkdirSync(logDir);
    } catch (err) {
      console.error("Failed to create logs directory:", err);
    }
  }

  transports.push(
    // Error logs
    new winston.transports.File({
      filename: path.join(logDir, "error.log"),
      level: "error",
      handleExceptions: true,
      maxsize: 5242880, // 5MB
      maxFiles: 5,
    }),
    // Combined logs
    new winston.transports.File({
      filename: path.join(logDir, "combined.log"),
      maxsize: 5242880, // 5MB
      maxFiles: 5,
    }),
  );
}

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || "info",
  format: baseFormat,
  transports,
});

// Create a stream object with a 'write' function that will be used by `morgan`
export const stream = {
  write: (message) => {
    logger.info(message.trim());
  },
};

export default logger;
