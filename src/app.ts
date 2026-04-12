import type { IncomingMessage, ServerResponse } from "node:http";
import Fastify from "fastify";
import cors from "@fastify/cors";
import cookie from "@fastify/cookie";
import { getEnv } from "./config/env.js";
import { errorHandler } from "./middleware/errorHandler.js";
import { waitlistRoutes } from "./modules/waitlist/waitlist.routes.js";

export async function buildApp() {
  const env = getEnv();
  const app = Fastify({
    logger: {
      level: "info"
    },
  });

  await app.register(cors, {
    origin: [
      "https://sync-murex-alpha.vercel.app",
      "http://localhost:5173",
      "https://synkspace.in",
      "https://www.synkspace.in"

    ],
    methods: ["GET","POST","PUT","DELETE","OPTIONS"],
    credentials: true,
  });

  await app.register(cookie, { secret: env.JWT_REFRESH_SECRET });
  app.setErrorHandler(errorHandler);

  app.get("/", async (_request, reply) => {
    return reply.send({
      service: "sync-api",
      docs: "REST API — open /health for a quick check.",
      health: "/health",
    });
  });

  app.get("/health", async (_request, reply) => {
    return reply.send({ ok: true, service: "sync-api" });
  });

  app.register(waitlistRoutes, { prefix: "/api/waitlist" });

  return app;
}

let vercelApp: Awaited<ReturnType<typeof buildApp>> | undefined;

async function getVercelApp() {
  if (!vercelApp) {
    vercelApp = await buildApp();
    await vercelApp.ready();
  }
  return vercelApp;
}

/** Vercel serverless entry: default export must be a function (see @vercel/node). */
export default async function handler(
  req: IncomingMessage,
  res: ServerResponse
): Promise<void> {
  const app = await getVercelApp();
  app.server.emit("request", req, res);
}
