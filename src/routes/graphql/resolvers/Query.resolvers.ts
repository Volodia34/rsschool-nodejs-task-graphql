import { GraphQLFieldConfigMap, GraphQLList, GraphQLNonNull, GraphQLObjectType } from 'graphql';
import { MemberType, MemberTypeIdEnum } from '../types/MemberType.type.js';
import { PostType } from '../types/Post.type.js';
import { UserType } from '../types/User.type.js';
import { ProfileType } from '../types/Profile.type.js';
import { UUIDType } from '../types/uuid.js';
import { GraphQLContext } from '../common/GraphQLContext.js';
import { MemberTypeId as PrismaMemberTypeId } from '../../member-types/schemas.js';

export const RootQueryResolvers: GraphQLFieldConfigMap<unknown, GraphQLContext> = {
  memberTypes: {
    type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(MemberType))),
    resolve: async (_, __, { prisma }) => prisma.memberType.findMany(),
  },
  posts: {
    type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(PostType))),
    resolve: async (_, __, { prisma }) => prisma.post.findMany(),
  },
  users: {
    type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(UserType))),
    resolve: async (_, __, { prisma, loaders }) => {
      const users = await prisma.user.findMany();
      return users;
    }
  },
  profiles: {
    type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(ProfileType))),
    resolve: async (_, __, { prisma }) => prisma.profile.findMany(),
  },
  memberType: {
    type: MemberType,
    args: { id: { type: new GraphQLNonNull(MemberTypeIdEnum) } },
    resolve: (_, { id }: { id: PrismaMemberTypeId }, { loaders }) =>
      loaders.memberTypeLoader.load(id),
  },
  post: {
    type: PostType,
    args: { id: { type: new GraphQLNonNull(UUIDType) } },
    resolve: async (_, { id }: { id: string }, { prisma }) =>
      prisma.post.findUnique({ where: { id } }),
  },
  user: {
    type: UserType,
    args: { id: { type: new GraphQLNonNull(UUIDType) } },
    resolve: (_, { id }: { id: string }, { loaders }) =>
      loaders.userLoader.load(id),
  },
  profile: {
    type: ProfileType,
    args: { id: { type: new GraphQLNonNull(UUIDType) } },
    resolve: async (_, { id }: { id: string }, { prisma }) =>
      prisma.profile.findUnique({ where: { id } }),
  },
};

export const RootQueryType = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: RootQueryResolvers,
});
