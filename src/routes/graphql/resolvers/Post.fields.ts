import { GraphQLFieldResolver } from 'graphql';
import { Post, User } from '@prisma/client';
import { GraphQLContext } from '../common/GraphQLContext.js';

export const postAuthorResolver: GraphQLFieldResolver<Post, GraphQLContext, unknown, Promise<User | null>> = async (source, _, { prisma }) => {
  if (!source.authorId) return null;
  return prisma.user.findUnique({ where: { id: source.authorId } });
};
