import { FastifyError, FastifyReply, FastifyRequest } from 'fastify';
import { ZodError } from 'zod';

export const errorHandler = (
  error: FastifyError, 
  request: FastifyRequest, 
  reply: FastifyReply
) => {
  // Use 'error' consistently. Cast to 'any' to access Prisma's .meta
  const prismaErr = error as any;

  if (prismaErr.code === 'P2002') {
    return reply.status(409).send({
      message: 'Conflict: Unique constraint failed',
      target: prismaErr.meta?.target 
    });
  }

  if (error instanceof ZodError) {
    return reply.status(400).send({
      message: error.errors[0]?.message || 'Invalid request data',
      issues: error.errors.map((issue) => ({
        path: issue.path.join('.'),
        message: issue.message,
      })),
    });
  }

  if (prismaErr.code === 'FST_ERR_CTP_BODY_TOO_LARGE') {
    return reply.status(413).send({
      message: 'Uploaded image is too large. Please choose a smaller image.',
    });
  }

  request.log.error(error); 
  return reply.status(500).send({ message: 'Internal Server Error' });
};
