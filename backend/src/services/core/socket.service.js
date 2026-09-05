import logger from "../../utils/logger.js";

export const initSocket = (server) => {
  logger.info(
    "Socket initialization skipped (using Cloudflare Durable Objects)",
  );
  return null;
};

export const emitEvent = async (env, projectId, event, data) => {
  const payload = {
    event,
    data: {
      ...data,
      timestamp: new Date().toISOString(),
    },
  };

  if (!env?.WEBSOCKET_DO) {
    logger.warn(`WEBSOCKET_DO not found. Event ${event} not sent.`);
    return;
  }

  try {
    const id = env.WEBSOCKET_DO.idFromName(String(projectId));
    const stub = env.WEBSOCKET_DO.get(id);

    await stub.fetch("http://internal/broadcast", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    logger.info(`Broadcasted event ${event} to project ${projectId} via DO`);
  } catch (err) {
    logger.error("Failed to broadcast via DO:", {
      error: err.message,
      stack: err.stack,
    });
  }
};

export const getIO = () => null;
