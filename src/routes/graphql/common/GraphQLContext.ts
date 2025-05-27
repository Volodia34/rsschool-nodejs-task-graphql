import { PrismaClient, User, Post, Profile, MemberType as PrismaMemberType } from '@prisma/client';
import { FastifyInstance } from 'fastify';
import DataLoader from 'dataloader';

export interface Loaders {
  userLoader: DataLoader<string, User | null>;
  postsByAuthorIdLoader: DataLoader<string, Post[]>;
  profileByUserIdLoader: DataLoader<string, Profile | null>;
  memberTypeLoader: DataLoader<string, PrismaMemberType | null>;
  authorsUserSubscribedToLoader: DataLoader<string, User[]>;
  subscribersToUserLoader: DataLoader<string, User[]>;
}

export interface GraphQLContext {
  prisma: PrismaClient;
  fastify: FastifyInstance;
  loaders: Loaders;
}
