import logger from "../../utils/logger.js";
import { workerEnv } from "../../server.js";

export const initSocket = (server) => {
  logger.info("Socket initialization skipped (using Cloudflare Durable Objects)");
  return null;
};

export const emitEvent = async (projectId, event, data) => {
  const payload = {
    event,
    data: {
      ...data,
      timestamp: new Date().toISOString(),
    }
  };

  if (workerEnv && workerEnv.WEBSOCKET_DO) {
    try {
      const id = workerEnv.WEBSOCKET_DO.idFromName(projectId);
      const stub = workerEnv.WEBSOCKET_DO.get(id);
      
      await stub.fetch("http://internal/broadcast", {
        method: "POST",
        body: JSON.stringify(payload)
      });
      logger.info(`Broadcasted event ${event} to project ${projectId} via DO`);
    } catch (err) {
      logger.error("Failed to broadcast via DO:", err);
    }
  } else {
    logger.warn(`workerEnv.WEBSOCKET_DO not found. Event ${event} not sent.`);
  }
};

export const getIO = () => null;
