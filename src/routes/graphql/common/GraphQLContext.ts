import { PrismaClient } from '@prisma/client';
import { FastifyInstance } from 'fastify';

export interface GraphQLContext {
  prisma: PrismaClient;
  fastify: FastifyInstance;
}
