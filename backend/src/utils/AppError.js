export class AppError extends Error {
  constructor(message, statusCode, isOperational = true, stack = "") {
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith("4") ? "fail" : "error";
    this.isOperational = isOperational;

    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

export const handleError = (err, req, res, _next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  // Log error
  console.error("💥 ERROR", err);
  if (req.logger) {
    req.logger.error(err.message, {
      method: req.method,
      url: req.originalUrl,
      stack: err.stack,
    });
  }

  // Development: Send detailed error
  if (process.env.NODE_ENV === "development") {
    res.status(err.statusCode).json({
      status: err.status,
      error: err,
      message: err.message,
      stack: err.stack,
    });
  } else {
    // Production: Send clean error
    if (err.isOperational) {
      res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
      });
    } else {
      // Programming or other unknown error: don't leak details
      console.error("ERROR 💥", err);
      res.status(500).json({
        status: "error",
        message: "Internal server error",
      });
    }
  }
};

export const catchAsync = (fn) => {
  return (req, res, next) => {
    fn(req, res, next).catch(next);
  };
};
