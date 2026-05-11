import { FastifyInstance, FastifyPluginOptions } from "fastify";
import * as onboardingService from "./onboarding.service.js";

export async function onboardingRoutes(app: FastifyInstance, _opts: FastifyPluginOptions) {
  app.post("/step", async (request, reply) => {
    try {
      const result = await onboardingService.saveOnboardingStep(request.body);
      return reply.status(200).send({ success: true, data: result });
    } catch (err) {
      if (err instanceof onboardingService.OnboardingServiceError) {
        const status = err.code === "ONBOARDING_INVALID_INPUT" ? 400 : 500;
        return reply.status(status).send({ success: false, error: { code: err.code } });
      }
      request.log.error({ err }, "onboarding.step unexpected error");
      return reply.status(500).send({ success: false, error: { code: "ONBOARDING_SERVER_ERROR" } });
    }
  });

  app.post("/complete", async (request, reply) => {
    const { role, data } = request.body as any;
    console.log("ONBOARDING DATA:", data);

    if (!role || !data) {
      return reply.status(400).send({
        success: false,
        error: { code: "ONBOARDING_INVALID_INPUT" }
      });
    }

    try {
      const result = await onboardingService.completeOnboarding(request.body);
      return reply.status(200).send({ success: true, data: result });
    } catch (err) {
      if (err instanceof onboardingService.OnboardingServiceError) {
        const status = err.code === "ONBOARDING_INVALID_INPUT" || err.code === "ONBOARDING_INCOMPLETE" ? 400 : 500;
        return reply.status(status).send({ success: false, error: { code: err.code } });
      }
      request.log.error({ err }, "onboarding.complete unexpected error");
      return reply.status(500).send({ success: false, error: { code: "ONBOARDING_SERVER_ERROR" } });
    }
  });
}

