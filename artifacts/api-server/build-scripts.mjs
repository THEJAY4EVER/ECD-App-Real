/**
 * build-scripts.mjs
 * Builds the one-shot admin/maintenance scripts (not the main server).
 * Usage: node build-scripts.mjs
 */
import { createRequire } from "node:module";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { build as esbuild } from "esbuild";

globalThis.require = createRequire(import.meta.url);

const artifactDir = path.dirname(fileURLToPath(import.meta.url));

const SHARED = {
  platform: "node",
  bundle: true,
  format: "esm",
  outdir: path.resolve(artifactDir, "dist"),
  outExtension: { ".js": ".mjs" },
  external: ["*.node", "pg-native"],
  sourcemap: "linked",
  banner: {
    js: `import { createRequire as __bannerCrReq } from 'node:module';
import __bannerPath from 'node:path';
import __bannerUrl from 'node:url';
globalThis.require = __bannerCrReq(import.meta.url);
globalThis.__filename = __bannerUrl.fileURLToPath(import.meta.url);
globalThis.__dirname = __bannerPath.dirname(globalThis.__filename);
`,
  },
};

async function buildAll() {
  await esbuild({ entryPoints: [path.resolve(artifactDir, "src/seed-users.ts")],              ...SHARED });
  await esbuild({ entryPoints: [path.resolve(artifactDir, "src/reset-seeded-passwords.ts")], ...SHARED });
  console.log("Scripts built → dist/seed-users.mjs, dist/reset-seeded-passwords.mjs");
}

buildAll().catch((err) => { console.error(err); process.exit(1); });
