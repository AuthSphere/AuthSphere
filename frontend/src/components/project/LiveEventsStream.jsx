import { useEffect, useState, useRef } from "react";
import { io } from "socket.io-client";
import { format } from "date-fns";

const LiveEventsStream = ({ projectId }) => {
  const [events, setEvents] = useState([]);
  const [connected, setConnected] = useState(false);
  const scrollRef = useRef(null);
  const socketRef = useRef(null);

  const addEvent = (event) => {
    setEvents((prev) => [
      ...prev.slice(-99),
      { ...event, id: Math.random().toString(36).substr(2, 9) },
    ]);
  };

  useEffect(() => {
    // Initialize socket connection
    const backendUrl =
      import.meta.env.VITE_BACKEND_URL || "http://localhost:8000";
    const socket = io(backendUrl, {
      query: { projectId },
      reconnectionAttempts: 5,
    });

    socketRef.current = socket;

    socket.on("connect", () => {
      setConnected(true);
      addEvent({
        type: "SYS",
        level: "INFO",
        message: "websocket connection established",
        color: "#00ff00",
      });
    });

    socket.on("disconnect", () => {
      setConnected(false);
      addEvent({
        type: "SYS",
        level: "WARN",
        message: "connection lost - attempting reconnect",
        color: "#ffaa00",
      });
    });

    // Listen for Auth Request
    socket.on("AUTH_REQUEST", (data) => {
      addEvent({
        type: "AUTH",
        level: "INFO",
        message: `auth_request provider=${data.provider} ip=${data.ip}`,
        details: `req_id=${data.requestId.slice(0, 12)}`,
        color: "#00aaff",
        timestamp: data.timestamp,
      });
    });

    // Listen for Auth Code Issued
    socket.on("AUTH_CODE_ISSUED", (data) => {
      addEvent({
        type: "AUTH",
        level: "OK",
        message: `identity_verified user=${data.email} provider=${data.provider}`,
        details: "authorization_code_issued",
        color: "#00ff00",
        timestamp: data.timestamp,
      });
    });

    // Listen for Token Exchanged
    socket.on("TOKEN_EXCHANGED", (data) => {
      addEvent({
        type: "TOKEN",
        level: "OK",
        message: `token_exchange_complete user=${data.email}`,
        details: `ip=${data.ip} session_established`,
        color: "#00ff00",
        timestamp: data.timestamp,
      });
    });

    // Listen for Token Refreshed
    socket.on("TOKEN_REFRESHED", (data) => {
      addEvent({
        type: "TOKEN",
        level: "INFO",
        message: `token_refresh user=${data.email}`,
        details: "new_jwt_issued session_extended",
        color: "#aa00ff",
        timestamp: data.timestamp,
      });
    });

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, [projectId]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth", block: "end" });
    }
  }, [events]);

  return (
    <div className="flex flex-col h-150 bg-black border border-[#00ff00]/20 font-mono text-sm overflow-hidden shadow-[0_0_30px_rgba(0,255,0,0.15)]">
      {/* Terminal Header */}
      <div className="flex items-center justify-between px-3 py-2 bg-[#0a0a0a] border-b border-[#00ff00]/20">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="text-[#00ff00] text-xs">●</span>
            <span className="text-[#00ff00]/70 text-xs uppercase tracking-wider">
              authsphere-telemetry
            </span>
          </div>
          <span className="text-[#00ff00]/30 text-xs">|</span>
          <span className="text-[#00ff00]/50 text-[10px]">
            {connected ? "CONNECTED" : "DISCONNECTED"}
          </span>
        </div>
        <div className="flex items-center gap-2 text-[10px] text-[#00ff00]/40">
          <span>buffer:{events.length}/100</span>
        </div>
      </div>

      {/* Terminal Body */}
      <div className="flex-1 overflow-y-auto p-3 space-y-0.5 bg-black scrollbar-thin scrollbar-track-transparent scrollbar-thumb-[#00ff00]/20">
        {events.length === 0 ? (
          <div className="h-full flex items-center justify-center">
            <div className="text-center space-y-2">
              <div className="text-[#00ff00]/30 text-xs animate-pulse">
                [WAITING FOR EVENTS...]
              </div>
              <div className="text-[#00ff00]/20 text-[10px]">
                listening on project {projectId.slice(0, 8)}...
              </div>
            </div>
          </div>
        ) : (
          events.map((event, idx) => {
            const timestamp = event.timestamp
              ? format(new Date(event.timestamp), "HH:mm:ss.SSS")
              : format(new Date(), "HH:mm:ss.SSS");

            return (
              <div
                key={event.id}
                className="leading-tight"
                ref={idx === events.length - 1 ? scrollRef : null}
              >
                <div className="flex items-start gap-2 text-xs">
                  {/* Timestamp */}
                  <span className="text-[#00ff00]/40 shrink-0 w-21.25">
                    [{timestamp}]
                  </span>

                  {/* Level */}
                  <span
                    className="shrink-0 w-11.25 font-bold"
                    style={{ color: event.color }}
                  >
                    {event.level}
                  </span>

                  {/* Type */}
                  <span className="text-[#00ff00]/60 shrink-0 w-12.5">
                    [{event.type}]
                  </span>

                  {/* Message */}
                  <span className="text-[#00ff00] flex-1">{event.message}</span>
                </div>

                {/* Details line */}
                {event.details && (
                  <div className="flex items-start gap-2 text-xs ml-45 mt-0.5">
                    <span className="text-[#00ff00]/50">└─</span>
                    <span className="text-[#00ff00]/60">{event.details}</span>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Terminal Footer / Prompt */}
      <div className="px-3 py-2 bg-[#0a0a0a] border-t border-[#00ff00]/20 flex items-center gap-2">
        <span className="text-[#00ff00]">$</span>
        <span className="text-[#00ff00]/50 text-xs animate-pulse">_</span>
        <span className="text-[#00ff00]/30 text-[10px] ml-auto">
          {connected ? "stream active" : "reconnecting..."}
        </span>
      </div>
    </div>
  );
};

export default LiveEventsStream;
