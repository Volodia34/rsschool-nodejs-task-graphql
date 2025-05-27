import { PrismaClient, User, Post, Profile, MemberType as PrismaMemberType } from '@prisma/client';
import { FastifyInstance } from 'fastify';
import DataLoader from 'dataloader';

export interface BasicLoaders {
  userLoader: DataLoader<string, User | null>;
  postsByAuthorIdLoader: DataLoader<string, Post[]>;
  profileByUserIdLoader: DataLoader<string, Profile | null>;
  memberTypeLoader: DataLoader<string, PrismaMemberType | null>;
}

export interface GraphQLContext {
  prisma: PrismaClient;
  fastify: FastifyInstance;
  loaders: BasicLoaders;
}
