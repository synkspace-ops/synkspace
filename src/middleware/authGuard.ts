import { FastifyRequest, FastifyReply } from "fastify";
import { verifyAccessToken } from "../modules/auth/auth.service.js";

export interface JwtPayload {
  sub: string;
  email: string;
  role: string;
  iat?: number;
  exp?: number;
}

export interface AuthenticatedUser {
  id: string;
  email: string;
  role: string;
}

declare module "fastify" {
  interface FastifyRequest {
    user?: AuthenticatedUser;
  }
}

export async function authGuard(
  request: FastifyRequest,
  reply: FastifyReply
): Promise<void> {
  const authHeader = request.headers.authorization;
  const token = authHeader?.startsWith("Bearer ") ? authHeader.slice(7) : null;
  if (!token) {
    await reply.status(401).send({
      error: "Unauthorized",
      message: "Missing or invalid Authorization header",
      statusCode: 401,
    });
    return;
  }
  try {
    const decoded = verifyAccessToken(token);
    request.user = {
      id: decoded.id,
      email: decoded.email,
      role: decoded.role,
    };
  } catch {
    await reply.status(401).send({
      error: "Unauthorized",
      message: "Invalid or expired token",
      statusCode: 401,
    });
  }
}
