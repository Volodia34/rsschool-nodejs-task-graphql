import { GraphQLFieldResolver } from 'graphql';
import { User, Post, Profile } from '@prisma/client';
import { GraphQLContext } from '../common/GraphQLContext.js';

export const userPostsResolver: GraphQLFieldResolver<User, GraphQLContext, unknown, Promise<Post[]>> = (source, _, { loaders }) => {
  return loaders.postsByAuthorIdLoader.load(source.id);
};

export const userProfileResolver: GraphQLFieldResolver<User, GraphQLContext, unknown, Promise<Profile | null>> = (source, _, { loaders }) => {
  return loaders.profileByUserIdLoader.load(source.id);
};

export const userSubscribedToResolver: GraphQLFieldResolver<User, GraphQLContext, unknown, Promise<User[]>> = (source, _, { prisma }) => {
  console.warn(`[User.fields] userSubscribedToResolver for ${source.id} using direct prisma call (TODO: DataLoader)`);
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

export const subscribedToUserResolver: GraphQLFieldResolver<User, GraphQLContext, unknown, Promise<User[]>> = (source, _, { prisma }) => {
  console.warn(`[User.fields] subscribedToUserResolver for ${source.id} using direct prisma call (TODO: DataLoader)`);
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
