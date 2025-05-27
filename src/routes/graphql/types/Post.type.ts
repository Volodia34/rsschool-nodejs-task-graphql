import { GraphQLNonNull, GraphQLObjectType, GraphQLString } from 'graphql';
import { UUIDType } from './uuid.js';
import { UserType } from './User.type.js';
import { Post } from '@prisma/client';
import { GraphQLContext } from '../common/GraphQLContext.js';

export const PostType = new GraphQLObjectType<Post, GraphQLContext>({
  name: 'Post',
  fields: () => ({
    id: { type: new GraphQLNonNull(UUIDType) },
    title: { type: new GraphQLNonNull(GraphQLString) },
    content: { type: new GraphQLNonNull(GraphQLString) },
    author: {
      type: UserType,
    },
    authorId: { type: new GraphQLNonNull(UUIDType) },
  }),
});
