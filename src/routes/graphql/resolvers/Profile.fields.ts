import { GraphQLFieldResolver } from 'graphql';
import { Profile, User, MemberType as PrismaMemberType } from '@prisma/client';
import { GraphQLContext } from '../common/GraphQLContext.js';

export const profileUserResolver: GraphQLFieldResolver<Profile, GraphQLContext, unknown, Promise<User | null>> = (source, _, { loaders }) => {
  if (!source.userId) return Promise.resolve(null);
  return loaders.userLoader.load(source.userId);
};

export const profileMemberTypeResolver: GraphQLFieldResolver<Profile, GraphQLContext, unknown, Promise<PrismaMemberType | null>> = (source, _, { loaders }) => {
  if (!source.memberTypeId) return Promise.resolve(null);
  return loaders.memberTypeLoader.load(source.memberTypeId);
};
