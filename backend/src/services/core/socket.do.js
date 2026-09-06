import { DurableObject } from "cloudflare:workers";

export class WebSocketManager extends DurableObject {
  constructor(ctx, env) {
    super(ctx, env);
    this.state = ctx;
    this.env = env;
  }

  async fetch(request) {
    const url = new URL(request.url);

    // Internal broadcast endpoint
    if (url.pathname === "/broadcast" && request.method === "POST") {
      const body = await request.json();

      const websockets = this.state.getWebSockets();
      let sentCount = 0;

      for (const ws of websockets) {
        try {
          ws.send(JSON.stringify(body));
          sentCount++;
        } catch {
          // Ignore disconnected sockets
        }
      }

      return Response.json({
        success: true,
        sent: sentCount,
      });
    }

    // WebSocket connection
    if (request.headers.get("Upgrade") !== "websocket") {
      return new Response("Expected Upgrade: websocket", {
        status: 426,
      });
    }

    const webSocketPair = new WebSocketPair();
    const client = webSocketPair[0];
    const server = webSocketPair[1];

    this.state.acceptWebSocket(server);

    return new Response(null, {
      status: 101,
      webSocket: client,
    });
  }

  webSocketMessage(ws, message) {
    // Handle messages from clients if needed later
  }

  webSocketClose(ws, code, reason, wasClean) {
    // Cloudflare handles the socket lifecycle.
  }

  webSocketError(ws, error) {
    // Socket errors are handled by the runtime.
  }
}
