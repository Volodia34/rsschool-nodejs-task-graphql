import { GraphQLBoolean, GraphQLInt, GraphQLNonNull, GraphQLObjectType } from 'graphql';
import { UUIDType } from './uuid.js';
import { UserType } from './User.type.js';
import { MemberType, MemberTypeIdEnum } from './MemberType.type.js';
import { Profile } from '@prisma/client';
import { GraphQLContext } from '../common/GraphQLContext.js';

export const ProfileType = new GraphQLObjectType<Profile, GraphQLContext>({
  name: 'Profile',
  fields: () => ({
    id: { type: new GraphQLNonNull(UUIDType) },
    isMale: { type: new GraphQLNonNull(GraphQLBoolean) },
    yearOfBirth: { type: new GraphQLNonNull(GraphQLInt) },
    user: {
      type: UserType,
    },
    userId: { type: new GraphQLNonNull(UUIDType) },
    memberType: {
      type: MemberType,
    },
    memberTypeId: { type: new GraphQLNonNull(MemberTypeIdEnum) },
  }),
});
