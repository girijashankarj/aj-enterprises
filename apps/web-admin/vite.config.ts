import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { VitePWA } from "vite-plugin-pwa";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootNodeModules = path.resolve(__dirname, "../../node_modules");
const localNm = path.resolve(__dirname, "node_modules");

function resolveHoisted(pkg: string): string {
  const local = path.join(localNm, pkg);
  if (fs.existsSync(local)) return local;
  return path.join(rootNodeModules, pkg);
}

/** Monorepo: force one React for hooks; resolve hoisted deps from repo root when not nested under apps/web-admin. */
/** GitHub Pages project sites use `https://<user>.github.io/<repo>/` — set `VITE_BASE_PATH` in CI (e.g. `/repo-name/`). */
const baseFromEnv = process.env.VITE_BASE_PATH?.trim();
const base =
  baseFromEnv && baseFromEnv !== "/"
    ? baseFromEnv.endsWith("/")
      ? baseFromEnv
      : `${baseFromEnv}/`
    : "/";

export default defineConfig({
  base,
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: ["favicon.svg", "pwa-192.png", "pwa-512.png"],
      manifest: {
        name: "AJ Enterprises — Operations & production platform",
        short_name: "AJ Enterprises",
        description:
          "Workshop operations: production tasks, live progress, employees, salary ledger, and leave — Bhosari, Pune.",
        theme_color: "#0f172a",
        background_color: "#f5f7fa",
        display: "standalone",
        orientation: "portrait-primary",
        scope: base,
        start_url: base,
        icons: [
          {
            src: "pwa-192.png",
            sizes: "192x192",
            type: "image/png",
            purpose: "any"
          },
          {
            src: "pwa-512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "any"
          },
          {
            src: "pwa-512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "maskable"
          }
        ]
      },
      workbox: {
        globPatterns: ["**/*.{js,css,html,ico,png,svg,woff2}"],
        navigateFallback: `${base}index.html`,
        // workbox-build production minify (terser) can fail on Node 24+; dev mode still precaches and satisfies installability.
        mode: "development"
      },
      devOptions: {
        enabled: false
      }
    })
  ],
  resolve: {
    dedupe: ["react", "react-dom"],
    alias: {
      react: resolveHoisted("react"),
      "react-dom": resolveHoisted("react-dom")
    }
  }
});
