import { FastifyInstance } from "fastify";

export default async function authRoutes(app: FastifyInstance) {
  app.post("/auth/register", async (req, reply) => {
    try {
      const body = req.body as {
        fullName: string;
        username: string;
        email: string;
        phone: string;
        password: string;
        country: string;
        state: string;
        city: string;
      };

      console.log("📥 Incoming Register Data:", body);

      // TEMP: just echo back
      return reply.send({
        success: true,
        message: "User received (not saved yet)",
        data: body,
      });
    } catch (err) {
      return reply.status(500).send({
        success: false,
        error: "Server error",
      });
    }
  });
}