import { GraphQLFieldResolver } from 'graphql';
import { User, Post, Profile } from '@prisma/client';
import { GraphQLContext } from '../common/GraphQLContext.js';

export const userPostsResolver: GraphQLFieldResolver<User, GraphQLContext, unknown, Promise<Post[]>> = async (source, _, { prisma }) => {
  return prisma.post.findMany({ where: { authorId: source.id } });
};

export const userProfileResolver: GraphQLFieldResolver<User, GraphQLContext, unknown, Promise<Profile | null>> = async (source, _, { prisma }) => {
  return prisma.profile.findUnique({ where: { userId: source.id } });
};

export const userSubscribedToResolver: GraphQLFieldResolver<User, GraphQLContext, unknown, Promise<User[]>> = async (source, _, { prisma }) => {
  return prisma.user.findMany({
    where: {
      subscribedToUser: {
        some: {
          subscriberId: source.id,
        },
      },
    },
  });
};

export const subscribedToUserResolver: GraphQLFieldResolver<User, GraphQLContext, unknown, Promise<User[]>> = async (source, _, { prisma }) => {
  return prisma.user.findMany({
    where: {
      userSubscribedTo: {
        some: {
          authorId: source.id,
        },
      },
    },
  });
};
