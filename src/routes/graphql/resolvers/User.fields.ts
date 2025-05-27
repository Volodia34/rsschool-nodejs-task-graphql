import { GraphQLFieldResolver } from 'graphql'; // GraphQLResolveInfo та parseResolveInfo поки не потрібні тут
import { User, Post, Profile } from '@prisma/client';
import { GraphQLContext } from '../common/GraphQLContext.js';

export const userPostsResolver: GraphQLFieldResolver<User, GraphQLContext, unknown, Promise<Post[]>> = (source, _, { loaders }) => {
  return loaders.postsByAuthorIdLoader.load(source.id);
};

export const userProfileResolver: GraphQLFieldResolver<User, GraphQLContext, unknown, Promise<Profile | null>> = (source, _, { loaders }) => {
  return loaders.profileByUserIdLoader.load(source.id);
};

export const userSubscribedToResolver: GraphQLFieldResolver<User, GraphQLContext, unknown, Promise<User[]>> = (source, _, { loaders }) => {
  return loaders.authorsUserSubscribedToLoader.load(source.id);
};

export const subscribedToUserResolver: GraphQLFieldResolver<User, GraphQLContext, unknown, Promise<User[]>> = (source, _, { loaders }) => {
  return loaders.subscribersToUserLoader.load(source.id);
};
