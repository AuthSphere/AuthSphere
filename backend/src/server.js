import { createServer } from "http";
import serverless from "serverless-http";
import { conf } from "./configs/env.js";
import app from "./app.js";
import connectDB, { closeDB } from "./database/connectDB.js";
import { logStartup } from "./utils/startup.js";
import { initSocket } from "./services/core/socket.service.js";
import logger from "./utils/logger.js";

const startServer = async () => {
  let httpServer;
  try {
    await connectDB();

    httpServer = createServer(app);
    initSocket(httpServer);

    httpServer.listen(conf.port, () => {
      logStartup(conf.port);
    });
  } catch (error) {
    logger.error("✖ Server failed to start", {
      error: error.message,
      stack: error.stack,
    });
    process.exit(1);
  }

  // Graceful Shutdown
  const shutdown = async (signal) => {
    logger.info(`${signal} signal received: closing HTTP server...`);
    if (httpServer) {
      httpServer.close(async () => {
        logger.info("HTTP server closed");
        await closeDB();
        process.exit(0);
      });
    } else {
      await closeDB();
      process.exit(0);
    }
  };

  process.on("SIGTERM", () => shutdown("SIGTERM"));
  process.on("SIGINT", () => shutdown("SIGINT"));
};

const isCloudflareWorker = typeof caches !== "undefined" || typeof WebSocketPair !== "undefined";

if (!isCloudflareWorker) {
  startServer();
}

export let workerEnv;
export { WebSocketManager } from "./services/core/socket.do.js";

const handler = serverless(app);

export default {
  async fetch(request, env, ctx) {
    workerEnv = env;
    
    const url = new URL(request.url);
    if (url.pathname === "/ws") {
      const projectId = url.searchParams.get("projectId");
      if (!projectId) {
        return new Response("Missing projectId", { status: 400 });
      }
      if (!env.WEBSOCKET_DO) {
        return new Response("Durable Object not bound", { status: 500 });
      }
      
      const id = env.WEBSOCKET_DO.idFromName(projectId);
      const stub = env.WEBSOCKET_DO.get(id);
      return stub.fetch(request);
    }

    await connectDB();
    return handler(request, env, ctx);
  },
};

