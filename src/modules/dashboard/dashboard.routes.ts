import { FastifyInstance, FastifyPluginOptions } from "fastify";
import { z } from "zod";
import { authGuard } from "../../middleware/authGuard.js";
import * as dashboardService from "./dashboard.service.js";

const campaignBodySchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  category: z.string().min(1),
  budgetMin: z.number().positive(),
  budgetMax: z.number().positive(),
  totalSlots: z.number().int().min(1),
  location: z.string().min(1),
  platforms: z.array(z.string()).min(1),
  deliverables: z.string().min(1),
  deadline: z.string().min(1),
  status: z.enum(["draft", "active"]).default("active"),
});

export async function dashboardRoutes(app: FastifyInstance, _opts: FastifyPluginOptions) {
  app.addHook("preHandler", authGuard);

  app.get("/", async (request, reply) => {
    const data = await dashboardService.getDashboardSnapshot(request.user!.id);
    return reply.send({ data, message: "OK" });
  });

  app.post("/campaigns", async (request, reply) => {
    const body = campaignBodySchema.parse(request.body);
    const data = await dashboardService.createDashboardCampaign(request.user!.id, body);
    return reply.status(201).send({ data, message: "Campaign created" });
  });

  app.patch<{ Params: { campaignId: string } }>(
    "/campaigns/:campaignId",
    async (request, reply) => {
      const body = z.object({ status: z.string().optional() }).parse(request.body);
      const data = await dashboardService.updateDashboardCampaign(
        request.user!.id,
        request.params.campaignId,
        body
      );
      return reply.send({ data, message: "Campaign updated" });
    }
  );

  app.delete<{ Params: { campaignId: string } }>(
    "/campaigns/:campaignId",
    async (request, reply) => {
      await dashboardService.deleteDashboardCampaign(request.user!.id, request.params.campaignId);
      return reply.send({ message: "Campaign deleted" });
    }
  );

  app.patch<{ Params: { applicationId: string } }>(
    "/applications/:applicationId",
    async (request, reply) => {
      const body = z.object({ status: z.string() }).parse(request.body);
      const data = await dashboardService.updateDashboardApplication(
        request.user!.id,
        request.params.applicationId,
        body.status
      );
      return reply.send({ data, message: "Application updated" });
    }
  );

  app.post<{ Params: { applicationId: string } }>(
    "/messages/:applicationId",
    async (request, reply) => {
      const body = z.object({ text: z.string().min(1).max(5000) }).parse(request.body);
      const data = await dashboardService.addDashboardMessage(
        request.user!.id,
        request.params.applicationId,
        body.text
      );
      return reply.status(201).send({ data, message: "Message sent" });
    }
  );
}
