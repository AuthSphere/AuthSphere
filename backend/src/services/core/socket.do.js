import logger from "../../utils/logger.js";

export class WebSocketManager {
  constructor(state, env) {
    this.state = state;
    this.env = env;
  }

  async fetch(request) {
    const url = new URL(request.url);

    if (url.pathname === "/broadcast" && request.method === "POST") {
      const body = await request.json();
      
      const websockets = this.state.getWebSockets();
      let sentCount = 0;
      
      for (const ws of websockets) {
        try {
          ws.send(JSON.stringify(body));
          sentCount++;
        } catch (err) {
        }
      }
      return new Response(JSON.stringify({ success: true, sent: sentCount }), { status: 200 });
    }

    const upgradeHeader = request.headers.get("Upgrade");
    if (!upgradeHeader || upgradeHeader !== "websocket") {
      return new Response("Expected Upgrade: websocket", { status: 426 });
    }

    const [client, server] = Object.values(new WebSocketPair());

    this.state.acceptWebSocket(server);

    return new Response(null, {
      status: 101,
      webSocket: client,
    });
  }

  webSocketMessage(ws, message) {
  }

  webSocketClose(ws, code, reason, wasClean) {
    ws.close(code, reason);
  }

  webSocketError(ws, error) {
    ws.close();
  }
}
