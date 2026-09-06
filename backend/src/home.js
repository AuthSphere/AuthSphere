import mongoose from "mongoose";
import { conf } from "./configs/env.js";

const homeHandler = (req, res) => {
  const memory = typeof process.memoryUsage === "function" ? process.memoryUsage() : { rss: 0 };
  const uptime = typeof process.uptime === "function" ? process.uptime() : 0;

  const apiData = {
    status: "OPERATIONAL",
    service: "AUTH-SPHERE-V2",
    metadata: {
      version: "2.4.0-STABLE",
      environment: (process.env.NODE_ENV || "production").toUpperCase(),
      region: process.env.VERCEL_REGION || "LOCAL-NODE",
      timestamp: new Date().toISOString(),
    },
    system: {
      uptime: `${Math.floor(uptime / 3600)}H ${Math.floor((uptime % 3600) / 60)}M ${Math.floor(uptime % 60)}S`,
      memory_usage: `${Math.round((memory.rss || 0) / 1024 / 1024)}MB`,
      node_v: process.version || "Cloudflare Worker",
      platform: (process.platform || "worker").toUpperCase(),
      db_status:
        mongoose.connection.readyState === 1 ? "CONNECTED" : "DISCONNECTED",
    },
    api_gateways: {
      authentication: "/api/v1/auth",
      developer_hub: "/api/v1/developers",
      management: "/api/v1/projects",
      monitoring: "/health",
    },
    resources: {
      documentation: "https://authsphere.vercel.app/docs",
      repository: "https://github.com/madhav9757/AuthSphere",
      status_page: "https://status.authsphere.io",
      frontend: conf.frontendUrl,
    },
  };

  if (req.accepts("html")) {
    res.set("Cache-Control", "no-store");
    return res.send(generateTerminalUI(apiData));
  }

  res.set("Cache-Control", "no-store");
  res.status(200).json(apiData);
};

const generateTerminalUI = (d) => `
<!DOCTYPE html>
<html lang="en" class="dark">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${d.service} // MGMT_CONSOLE</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;700;800&display=swap" rel="stylesheet">
    <style>
        :root { --accent: #00FF41; }
        body { font-family: 'JetBrains Mono', monospace; scrollbar-width: none; }
        .tech-border { border: 1px solid rgba(255,255,255,0.1); }
        .tech-border-thick { border: 2px solid #000; }
        .shimmer { animation: shimmer 2s infinite; }
        @keyframes shimmer { 0% { opacity: 0.5; } 50% { opacity: 1; } 100% { opacity: 0.5; } }
        .grid-bg { background-image: radial-gradient(rgba(0,0,0,0.1) 1px, transparent 0); background-size: 24px 24px; }
        ::selection { background: #000; color: #fff; }
    </style>
</head>
<body class="bg-[#F8F8F8] text-black min-h-screen flex flex-col selection:bg-black selection:text-white">
    <!-- TOP BAR -->
    <header class="border-b-4 border-black p-6 flex justify-between items-center bg-white/90 backdrop-blur-xl sticky top-0 z-50">
        <div class="flex items-center gap-6">
            <div class="w-16 h-16 border-2 border-black rounded-2xl flex items-center justify-center bg-white shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] overflow-hidden p-2 transition-transform hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                <img src="/assets/AuthSphere(main).png" alt="AuthSphere Logo" class="w-full h-full object-contain mix-blend-multiply" style="filter: contrast(1.1) brightness(1.1);">
            </div>
            <div>
                <h1 class="font-900 text-3xl tracking-tighter leading-none flex items-center gap-3">
                    ${d.service}
                    <span class="text-[10px] bg-black text-white px-2 py-1 rounded-sm tracking-[0.2em] translate-y-[-2px] font-black uppercase">STABLE_CORE</span>
                </h1>
                <div class="flex items-center gap-3 mt-1">
                    <span class="text-[9px] font-bold tracking-[0.3em] text-gray-400">IDENTITY_INFRASTRUCTURE // GLOBAL_SHARD_v2.4.0</span>
                    <span class="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                </div>
            </div>
        </div>
        <div class="text-right hidden sm:block">
            <div class="text-[10px] font-bold text-gray-400 mb-1">SYSTEM_TIME</div>
            <div id="clock" class="text-xl font-800 tabular-nums">00:00:00</div>
        </div>
    </header>

    <main class="flex-grow p-6 md:p-12 max-w-[1400px] mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-8">
        <!-- LEFT: SYSTEM VITALS -->
        <div class="lg:col-span-4 space-y-8">
            <section class="space-y-4">
                <div class="flex items-center gap-2">
                    <div class="w-2 h-2 bg-black rounded-full shimmer"></div>
                    <h2 class="text-[10px] font-800 tracking-[0.5em] text-gray-400 uppercase">System_Vitals</h2>
                </div>
                <div class="border-2 border-black p-6 bg-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] space-y-6">
                    <div class="flex justify-between items-end border-b pb-4 border-gray-100">
                        <span class="text-[10px] font-bold text-gray-400">STATUS</span>
                        <span class="text-xl font-800 text-emerald-600">${d.status}</span>
                    </div>
                    <div class="flex justify-between items-end border-b pb-4 border-gray-100">
                        <span class="text-[10px] font-bold text-gray-400">DATABASE</span>
                        <span class="text-xl font-800 ${d.system.db_status === "CONNECTED" ? "text-black" : "text-red-500"}">${d.system.db_status}</span>
                    </div>
                    <div class="flex justify-between items-end border-b pb-4 border-gray-100">
                        <span class="text-[10px] font-bold text-gray-400">ACTIVE_UPTIME</span>
                        <span class="text-xl font-800 tabular-nums">${d.system.uptime}</span>
                    </div>
                    <div class="flex justify-between items-end">
                        <span class="text-[10px] font-bold text-gray-400">MEM_RESOURCES</span>
                        <span class="text-xl font-800 tabular-nums">${d.system.memory_usage}</span>
                    </div>
                </div>
            </section>

            <section class="space-y-4">
                <h2 class="text-[10px] font-800 tracking-[0.5em] text-gray-400 uppercase">Environment</h2>
                <div class="grid grid-cols-2 border-2 border-black bg-white">
                    <div class="p-4 border-r-2 border-black">
                        <p class="text-[9px] font-bold text-gray-400 uppercase mb-1">Region</p>
                        <p class="font-800 text-sm">${d.metadata.region}</p>
                    </div>
                    <div class="p-4">
                        <p class="text-[9px] font-bold text-gray-400 uppercase mb-1">Platform</p>
                        <p class="font-800 text-sm">${d.system.platform}</p>
                    </div>
                    <div class="p-4 border-t-2 border-r-2 border-black">
                        <p class="text-[9px] font-bold text-gray-400 uppercase mb-1">Node_V</p>
                        <p class="font-800 text-sm">${d.system.node_v}</p>
                    </div>
                    <div class="p-4 border-t-2 border-black">
                        <p class="text-[9px] font-bold text-gray-400 uppercase mb-1">Build_Env</p>
                        <p class="font-800 text-sm">${d.metadata.environment}</p>
                    </div>
                </div>
            </section>
        </div>

        <!-- RIGHT: ENDPOINTS & DOCS -->
        <div class="lg:col-span-8 space-y-8">
            <section class="space-y-4">
                <h2 class="text-[10px] font-800 tracking-[0.5em] text-gray-400 uppercase">Gateway_Mappings</h2>
                <div class="border-2 border-black bg-white divide-y-2 divide-black">
                    ${Object.entries(d.api_gateways)
                      .map(
                        ([name, path]) => `
                        <a href="${path}" class="p-6 flex justify-between items-center group hover:bg-black transition-colors">
                            <div>
                                <span class="text-[9px] font-bold text-gray-400 group-hover:text-gray-500 uppercase block mb-1">${name}</span>
                                <span class="text-xl font-800 group-hover:text-white transition-colors">${path}</span>
                            </div>
                            <div class="w-10 h-10 border-2 border-black flex items-center justify-center group-hover:border-white group-hover:text-white transition-all transform group-hover:translate-x-1">
                                <span class="font-bold">-></span>
                            </div>
                        </a>
                    `,
                      )
                      .join("")}
                </div>
            </section>

            <section class="flex flex-wrap gap-4">
                <a href="${d.resources.documentation}" target="_blank" class="px-8 py-5 bg-black text-white text-xs font-800 tracking-widest hover:bg-emerald-600 transition-colors flex items-center gap-3">
                    READ_DOCUMENTATION <span class="text-lg">↗</span>
                </a>
                <a href="${d.resources.repository}" target="_blank" class="px-8 py-5 border-2 border-black text-xs font-800 tracking-widest hover:bg-black hover:text-white transition-colors flex items-center gap-3">
                    SOURCE_REPOSITORY <span class="text-lg">↗</span>
                </a>
            </section>
        </div>
    </main>

    <footer class="p-6 md:p-10 border-t-4 border-black bg-white mt-auto">
        <div class="max-w-[1400px] mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
            <div class="flex gap-10">
                <div class="space-y-1">
                    <p class="text-[9px] font-bold text-gray-400">SECURITY_MODULE</p>
                    <p class="text-[11px] font-800">AES_256_GCM_ENCRYPTED</p>
                </div>
                <div class="space-y-1">
                    <p class="text-[9px] font-bold text-gray-400">PROTOCOL</p>
                    <p class="text-[11px] font-800">TLS_1.3_STRICT</p>
                </div>
                <div class="space-y-1">
                    <p class="text-[9px] font-bold text-gray-400">REGION_GATEWAY</p>
                    <p class="text-[11px] font-800">${d.metadata.region}</p>
                </div>
            </div>
            <p class="text-[10px] font-800 tracking-widest text-gray-300">© 2026 AUTH_SPHERE // PRODUCTION_CORE_V2 <!-- CACHE_BUST_1 --></p>
        </div>
    </footer>

    <script>
        const updateClock = () => {
            const now = new Date();
            document.getElementById('clock').innerText = now.toTimeString().split(' ')[0];
        };
        setInterval(updateClock, 1000);
        updateClock();
    </script>
</body>
</html>
`;

export default homeHandler;
