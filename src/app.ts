import type { IncomingMessage, ServerResponse } from "node:http";
import Fastify from "fastify";
import cors from "@fastify/cors";
import cookie from "@fastify/cookie";
import { getEnv } from "./config/env.js";
import { errorHandler } from "./middleware/errorHandler.js";
import { waitlistRoutes } from "./modules/waitlist/waitlist.routes.js";
import { authRoutes } from "./modules/auth/auth.routes.js";
import { onboardingRoutes } from "./modules/onboarding/onboarding.routes.js";
import { campaignRoutes } from "./modules/campaigns/campaigns.routes.js";
import { applicationRoutes } from "./modules/applications/applications.routes.js";
import { escrowRoutes } from "./modules/escrow/escrow.routes.js";
import { dashboardRoutes } from "./modules/dashboard/dashboard.routes.js";
import { notificationRoutes } from "./modules/notifications/notifications.routes.js";
import { adminRoutes } from "./modules/admin/admin.routes.js";
import { userRoutes } from "./modules/users/users.routes.js";
import { trackingRoutes } from "./modules/tracking/tracking.routes.js";

export async function buildApp() {
  const env = getEnv();
  const app = Fastify({
    bodyLimit: 6 * 1024 * 1024,
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
    methods: ["GET","POST","PUT","PATCH","DELETE","OPTIONS"],
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
  app.register(authRoutes, { prefix: "/api/auth" }); // ✅ ADD THIS LINE
  app.register(onboardingRoutes, { prefix: "/api/onboarding" });
  app.register(campaignRoutes, { prefix: "/api/campaigns" });
  app.register(applicationRoutes, { prefix: "/api/campaigns" });
  app.register(escrowRoutes, { prefix: "/api/escrow" });
  app.register(dashboardRoutes, { prefix: "/api/dashboard" });
  app.register(notificationRoutes, { prefix: "/api/notifications" });
  app.register(adminRoutes, { prefix: "/api/admin" });
  app.register(userRoutes, { prefix: "/api/users" });
  app.register(trackingRoutes, { prefix: "/api/tracking" });

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
