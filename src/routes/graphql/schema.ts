import { GraphQLSchema } from 'graphql';
import { RootQueryType } from './resolvers/Query.resolvers.js';

import { UserType } from './types/User.type.js';
import { PostType } from './types/Post.type.js';
import { ProfileType } from './types/Profile.type.js';
import { MemberType } from './types/MemberType.type.js';

import { userPostsResolver, userProfileResolver, userSubscribedToResolver, subscribedToUserResolver } from './resolvers/User.fields.js';
import { postAuthorResolver } from './resolvers/Post.fields.js';
import { profileUserResolver, profileMemberTypeResolver } from './resolvers/Profile.fields.js';

export const schema = new GraphQLSchema({
  query: RootQueryType,
});

const userFields = UserType.getFields();
if (userFields.posts) userFields.posts.resolve = userPostsResolver;
if (userFields.profile) userFields.profile.resolve = userProfileResolver;
if (userFields.userSubscribedTo) userFields.userSubscribedTo.resolve = userSubscribedToResolver;
if (userFields.subscribedToUser) userFields.subscribedToUser.resolve = subscribedToUserResolver;

const postFields = PostType.getFields();
if (postFields.author) postFields.author.resolve = postAuthorResolver;

const profileFields = ProfileType.getFields();
if (profileFields.user) profileFields.user.resolve = profileUserResolver;
if (profileFields.memberType) profileFields.memberType.resolve = profileMemberTypeResolver;
