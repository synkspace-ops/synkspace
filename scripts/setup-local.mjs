/**
 * One-shot local setup: ensure .env, start Docker if available, prisma db push.
 * Usage: node scripts/setup-local.mjs
 */
import { spawnSync } from "node:child_process";
import { existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { setTimeout as delay } from "node:timers/promises";

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const envPath = join(root, ".env");

function run(cmd, args) {
  const r = spawnSync(cmd, args, {
    cwd: root,
    stdio: "inherit",
    shell: process.platform === "win32",
  });
  return r.status ?? 1;
}

console.log("=== Sync API — local setup ===\n");

if (!existsSync(envPath)) {
  console.log("No .env found — generating with npm run env:local …\n");
  const g = run("npm", ["run", "env:local"]);
  if (g !== 0) process.exit(g);
} else {
  console.log(".env already exists (skip env:local)\n");
}

const dockerCheck = spawnSync("docker", ["compose", "version"], {
  encoding: "utf8",
  shell: process.platform === "win32",
});
const hasDocker = dockerCheck.status === 0;

if (hasDocker) {
  console.log("Starting Postgres + Redis (docker compose) …\n");
  const up = run("docker", ["compose", "up", "-d"]);
  if (up !== 0) {
    console.error("\ndocker compose failed. Fix Docker, then run: npx prisma db push && npm run dev\n");
    process.exit(up);
  }
  console.log("\nWaiting 5s for Postgres to accept connections …");
  await delay(5000);
} else {
  console.log(
    [
      "Docker not found in PATH.",
      "",
      "Option A — Install Docker Desktop for Windows, then re-run:",
      "  npm run setup:local",
      "",
      "Option B — Use cloud Postgres + Redis (no Docker):",
      "  Edit .env and set:",
      "    DATABASE_URL=postgresql://…  (Supabase: Project Settings → Database → URI)",
      "    REDIS_URL=…                  (e.g. Upstash → copy Redis URL)",
      "  Then run:",
      "    npx prisma db push",
      "    npm run dev",
      "",
    ].join("\n")
  );
  console.log("(Skipping prisma db push until a database is reachable.)\n");
  process.exit(0);
}

console.log("\nApplying Prisma schema (db push) …\n");
const push = run("npx", ["prisma", "db", "push"]);
if (push !== 0) {
  console.error(
    "\nPrisma could not reach the database. Fix DATABASE_URL / start Docker, then: npx prisma db push\n"
  );
  process.exit(push);
}

console.log("\n=== Done. Start the API with: npm run dev ===");
console.log("Then open: http://localhost:4000/health\n");
