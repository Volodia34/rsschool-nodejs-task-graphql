import { GraphQLFieldResolver } from 'graphql';
import { Post, User } from '@prisma/client';
import { GraphQLContext } from '../common/GraphQLContext.js';

export const postAuthorResolver: GraphQLFieldResolver<Post, GraphQLContext, unknown, Promise<User | null>> = (source, _, { loaders }) => {
  if (!source.authorId) return Promise.resolve(null);
  return loaders.userLoader.load(source.authorId);
};
