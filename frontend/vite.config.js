import process from "node:process";
import path from "path";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

import { VitePWA } from "vite-plugin-pwa";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      disable:
        process.env.NODE_ENV === "production" &&
        process.env.ENABLE_PWA !== "true",
      registerType: "autoUpdate",
      includeAssets: ["assets/AuthSphere(main).png", "assets/AuthSphere.png"],
      manifest: {
        name: "AuthSphere Dashboard",
        short_name: "AuthSphere",
        description: "Mobile dashboard for AuthSphere authentication stats",
        theme_color: "#0a0a0a",
        background_color: "#0a0a0a",
        display: "standalone",
        icons: [
          {
            src: "assets/AuthSphere(main).png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "assets/AuthSphere(main).png",
            sizes: "512x512",
            type: "image/png",
          },
        ],
      },
    }),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
    extensions: [".mjs", ".js", ".mts", ".ts", ".jsx", ".tsx", ".json"],
  },
  server: {
    port: 5173,
    host: true,
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("node_modules/recharts")) {
            return "vendor-recharts";
          }
        },
      },
      onwarn(warning, warn) {
        if (warning.code === "INVALID_ANNOTATION") return;
        warn(warning);
      },
    },
  },
});
