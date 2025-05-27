import { GraphQLBoolean, GraphQLFieldConfigMap, GraphQLNonNull, GraphQLObjectType } from 'graphql';
import { UserType } from '../types/User.type.js';
import { PostType } from '../types/Post.type.js';
import { ProfileType } from '../types/Profile.type.js';
import { UUIDType } from '../types/uuid.js';
import { GraphQLContext } from '../common/GraphQLContext.js';

import { CreateUserInput } from '../inputs/CreateUserInput.input.js';
import { ChangeUserInput } from '../inputs/ChangeUserInput.input.js';
import { CreatePostInput } from '../inputs/CreatePostInput.input.js';
import { ChangePostInput } from '../inputs/ChangePostInput.input.js';
import { CreateProfileInput } from '../inputs/CreateProfileInput.input.js';
import { ChangeProfileInput } from '../inputs/ChangeProfileInput.input.js';

interface CreateUserArgs { dto: { name: string; balance: number } }
interface ChangeUserArgs { id: string; dto: { name?: string; balance?: number } }
interface DeleteUserArgs { id: string }

interface CreatePostArgs { dto: { authorId: string; title: string; content: string } }
interface ChangePostArgs { id: string; dto: { title?: string; content?: string } }
interface DeletePostArgs { id: string }

interface CreateProfileArgs { dto: { userId: string; memberTypeId: string; isMale: boolean; yearOfBirth: number } }
interface ChangeProfileArgs { id: string; dto: { memberTypeId?: string; isMale?: boolean; yearOfBirth?: number } }
interface DeleteProfileArgs { id: string }

interface SubscribeToArgs { userId: string; authorId: string }
interface UnsubscribeFromArgs { userId: string; authorId: string }


export const RootMutationResolvers: GraphQLFieldConfigMap<unknown, GraphQLContext> = {
  createUser: {
    type: new GraphQLNonNull(UserType),
    args: {
      dto: { type: new GraphQLNonNull(CreateUserInput) },
    },
    resolve: async (_, { dto }: CreateUserArgs, { prisma }) => {
      return prisma.user.create({ data: dto });
    },
  },
  changeUser: {
    type: new GraphQLNonNull(UserType),
    args: {
      id: { type: new GraphQLNonNull(UUIDType) },
      dto: { type: new GraphQLNonNull(ChangeUserInput) },
    },
    resolve: async (_, { id, dto }: ChangeUserArgs, { prisma }) => {
      return prisma.user.update({ where: { id }, data: dto });
    },
  },
  deleteUser: {
    type: GraphQLBoolean,
    args: {
      id: { type: new GraphQLNonNull(UUIDType) },
    },
    resolve: async (_, { id }: DeleteUserArgs, { prisma, fastify }) => {
      try {
        await prisma.user.delete({ where: { id } });
        return true;
      } catch (error) {
        fastify.log.error(error);
        return false;
      }
    },
  },

  createPost: {
    type: new GraphQLNonNull(PostType),
    args: {
      dto: { type: new GraphQLNonNull(CreatePostInput) },
    },
    resolve: async (_, { dto }: CreatePostArgs, { prisma }) => {
      return prisma.post.create({ data: dto });
    },
  },
  changePost: {
    type: new GraphQLNonNull(PostType),
    args: {
      id: { type: new GraphQLNonNull(UUIDType) },
      dto: { type: new GraphQLNonNull(ChangePostInput) },
    },
    resolve: async (_, { id, dto }: ChangePostArgs, { prisma }) => {
      return prisma.post.update({ where: { id }, data: dto });
    },
  },
  deletePost: {
    type: GraphQLBoolean,
    args: {
      id: { type: new GraphQLNonNull(UUIDType) },
    },
    resolve: async (_, { id }: DeletePostArgs, { prisma, fastify }) => {
      try {
        await prisma.post.delete({ where: { id } });
        return true;
      } catch (error) {
        fastify.log.error(error);
        return false;
      }
    },
  },

  createProfile: {
    type: new GraphQLNonNull(ProfileType),
    args: {
      dto: { type: new GraphQLNonNull(CreateProfileInput) },
    },
    resolve: async (_, { dto }: CreateProfileArgs, { prisma }) => {
      return prisma.profile.create({ data: dto });
    },
  },
  changeProfile: {
    type: new GraphQLNonNull(ProfileType),
    args: {
      id: { type: new GraphQLNonNull(UUIDType) },
      dto: { type: new GraphQLNonNull(ChangeProfileInput) },
    },
    resolve: async (_, { id, dto }: ChangeProfileArgs, { prisma }) => {
      return prisma.profile.update({ where: { id }, data: dto });
    },
  },
  deleteProfile: {
    type: GraphQLBoolean,
    args: {
      id: { type: new GraphQLNonNull(UUIDType) },
    },
    resolve: async (_, { id }: DeleteProfileArgs, { prisma, fastify }) => {
      try {
        await prisma.profile.delete({ where: { id } });
        return true;
      } catch (error) {
        fastify.log.error(error);
        return false;
      }
    },
  },

  subscribeTo: {
    type: GraphQLBoolean,
    args: {
      userId: { type: new GraphQLNonNull(UUIDType) },
      authorId: { type: new GraphQLNonNull(UUIDType) },
    },
    resolve: async (_, { userId, authorId }: SubscribeToArgs, { prisma }) => {
      if (userId === authorId) {
        return false;
      }
      await prisma.subscribersOnAuthors.create({
        data: {
          subscriberId: userId,
          authorId: authorId,
        },
      });
      return true;
    },
  },
  unsubscribeFrom: {
    type: GraphQLBoolean,
    args: {
      userId: { type: new GraphQLNonNull(UUIDType) },
      authorId: { type: new GraphQLNonNull(UUIDType) },
    },
    resolve: async (_, { userId, authorId }: UnsubscribeFromArgs, { prisma }) => {
      await prisma.subscribersOnAuthors.delete({
        where: {
          subscriberId_authorId: {
            subscriberId: userId,
            authorId: authorId,
          },
        },
      });
      return true;
    },
  },
};

export const RootMutationType = new GraphQLObjectType({
  name: 'RootMutationType',
  fields: RootMutationResolvers,
});
