import { FastifyInstance, FastifyPluginOptions } from "fastify";
import { z } from "zod";
import { verifyAccessToken } from "../auth/auth.service.js";
import { prisma } from "../../db/client.js";

const pageViewSchema = z.object({
  sessionId: z.string().min(1).max(200).optional(),
  path: z.string().min(1).max(600),
  referrer: z.string().max(1000).optional().nullable(),
});

export async function trackingRoutes(app: FastifyInstance, _opts: FastifyPluginOptions) {
  app.post("/page-view", async (request, reply) => {
    const body = pageViewSchema.parse(request.body);
    const authHeader = request.headers.authorization;
    const token = authHeader?.startsWith("Bearer ") ? authHeader.slice(7) : "";
    let userId: string | null = null;

    if (token) {
      try {
        userId = verifyAccessToken(token).id;
      } catch {
        userId = null;
      }
    }

    await prisma.trafficEvent.create({
      data: {
        sessionId: body.sessionId,
        userId,
        path: body.path,
        referrer: body.referrer || null,
        userAgent: request.headers["user-agent"] || null,
        ip: request.ip,
      },
    });

    return reply.status(201).send({ data: { tracked: true }, message: "Tracked" });
  });
}
