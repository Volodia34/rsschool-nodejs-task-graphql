import { GraphQLBoolean, GraphQLInputObjectType, GraphQLInt } from 'graphql';
import { MemberTypeIdEnum } from '../types/MemberType.type.js';

export const ChangeProfileInput = new GraphQLInputObjectType({
  name: 'ChangeProfileInput',
  fields: () => ({
    memberTypeId: { type: MemberTypeIdEnum },
    isMale: { type: GraphQLBoolean },
    yearOfBirth: { type: GraphQLInt },
  }),
});
