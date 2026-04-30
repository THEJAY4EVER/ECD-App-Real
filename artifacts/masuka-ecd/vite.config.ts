import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";
import { spawn } from "child_process";

const rawPort = process.env.PORT;
const port = rawPort ? Number(rawPort) : 5173;

if (Number.isNaN(port) || port <= 0) {
  throw new Error(`Invalid PORT value: "${rawPort}"`);
}

const basePath = process.env.BASE_PATH ?? "/";
const API_PORT = 9001;

export default defineConfig({
  base: basePath,
  plugins: [
    react(),
    tailwindcss(),
    runtimeErrorOverlay(),
    ...(process.env.NODE_ENV !== "production" &&
    process.env.REPL_ID !== undefined
      ? [
          await import("@replit/vite-plugin-cartographer").then((m) =>
            m.cartographer({
              root: path.resolve(import.meta.dirname, ".."),
            }),
          ),
          await import("@replit/vite-plugin-dev-banner").then((m) =>
            m.devBanner(),
          ),
        ]
      : []),
    {
      name: "api-server-spawn",
      configureServer(server) {
        const api = spawn(
          "node",
          ["--enable-source-maps", path.resolve(import.meta.dirname, "../api-server/dist/index.mjs")],
          {
            env: { ...process.env, PORT: String(API_PORT), NODE_ENV: "development" },
            stdio: "pipe",
          }
        );
        api.stdout?.on("data", (d: Buffer) => process.stdout.write(`[api] ${d}`));
        api.stderr?.on("data", (d: Buffer) => process.stderr.write(`[api] ${d}`));
        api.on("exit", (code) => console.log(`[api] exited with code ${code}`));
        server.httpServer?.on("close", () => { api.kill("SIGTERM"); });
      },
    },
  ],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "src"),
      "@assets": path.resolve(import.meta.dirname, "..", "..", "attached_assets"),
      "@tanstack/react-query": path.resolve(
        import.meta.dirname,
        "node_modules/@tanstack/react-query",
      ),
    },
    dedupe: ["react", "react-dom", "@tanstack/react-query"],
  },
  root: path.resolve(import.meta.dirname),
  build: {
    outDir: path.resolve(import.meta.dirname, "dist/public"),
    emptyOutDir: true,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("node_modules/framer-motion/")) {
            return "vendor-framer-motion";
          }
          if (
            id.includes("node_modules/recharts/") ||
            id.includes("node_modules/victory-vendor/") ||
            id.includes("node_modules/d3-") ||
            id.includes("node_modules/d3/")
          ) {
            return "vendor-recharts";
          }
          if (id.includes("node_modules/@radix-ui/")) {
            return "vendor-radix-ui";
          }
          if (id.includes("node_modules/lucide-react/")) {
            return "vendor-lucide";
          }
          if (
            id.includes("node_modules/react/") ||
            id.includes("node_modules/react-dom/") ||
            id.includes("node_modules/scheduler/")
          ) {
            return "vendor-react";
          }
          if (id.includes("node_modules/")) {
            return "vendor-misc";
          }
        },
      },
    },
  },
  server: {
    port,
    strictPort: true,
    host: "0.0.0.0",
    allowedHosts: true,
    fs: {
      strict: true,
    },
    proxy: {
      "/api": {
        target: `http://localhost:${API_PORT}`,
        changeOrigin: false,
        rewrite: (p) => p,
      },
    },
  },
  preview: {
    port,
    host: "0.0.0.0",
    allowedHosts: true,
  },
});
