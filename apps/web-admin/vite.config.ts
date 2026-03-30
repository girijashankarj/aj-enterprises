import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

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
  plugins: [react(), tailwindcss()],
  resolve: {
    dedupe: ["react", "react-dom"],
    alias: {
      react: resolveHoisted("react"),
      "react-dom": resolveHoisted("react-dom")
    }
  }
});
