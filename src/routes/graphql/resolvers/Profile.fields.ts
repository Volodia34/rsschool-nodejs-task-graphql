import { GraphQLFieldResolver } from 'graphql';
import { Profile, User, MemberType as PrismaMemberType } from '@prisma/client';
import { GraphQLContext } from '../common/GraphQLContext.js';

export const profileUserResolver: GraphQLFieldResolver<Profile, GraphQLContext, unknown, Promise<User | null>> = async (source, _, { prisma }) => {
  if (!source.userId) return null;
  return prisma.user.findUnique({ where: { id: source.userId } });
};

export const profileMemberTypeResolver: GraphQLFieldResolver<Profile, GraphQLContext, unknown, Promise<PrismaMemberType | null>> = async (source, _, { prisma }) => {
  if (!source.memberTypeId) return null;
  return prisma.memberType.findUnique({ where: { id: source.memberTypeId } });
};
