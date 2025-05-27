import { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox';
import { createGqlResponseSchema, gqlResponseSchema } from './schemas.js';
import { GraphQLSchema, graphql, parse, validate, DocumentNode, GraphQLError } from 'graphql';
import { schema } from './schema.js';
import { GraphQLContext, Loaders } from './common/GraphQLContext.js';
import depthLimit from 'graphql-depth-limit';

import { createUserLoaders } from './loaders/UserLoaders.js';
import { createPostLoaders } from './loaders/PostLoaders.js';
import { createProfileLoaders } from './loaders/ProfileLoaders.js';
import { createMemberTypeLoaders } from './loaders/MemberTypeLoaders.js';

const MAX_DEPTH = 5;

interface GraphQLRequestBody {
  query: string;
  variables?: Record<string, unknown>;
  operationName?: string;
}

const plugin: FastifyPluginAsyncTypebox = async (fastify) => {
  fastify.route({
    url: '/',
    method: 'POST',
    schema: {
      ...createGqlResponseSchema,
      response: {
        200: gqlResponseSchema,
      },
    },
    async handler(req) {
      const { query, variables, operationName } = req.body as GraphQLRequestBody;

      const userLoaders = createUserLoaders(fastify.prisma);

      const loaders: Loaders = {
        userLoader: userLoaders.userLoader,
        postsByAuthorIdLoader: createPostLoaders(fastify.prisma).postsByAuthorIdLoader,
        profileByUserIdLoader: createProfileLoaders(fastify.prisma).profileByUserIdLoader,
        memberTypeLoader: createMemberTypeLoaders(fastify.prisma).memberTypeLoader,
        authorsUserSubscribedToLoader: userLoaders.authorsUserSubscribedToLoader,
        subscribersToUserLoader: userLoaders.subscribersToUserLoader,
      };

      const contextValue: GraphQLContext = {
        prisma: fastify.prisma,
        fastify: fastify,
        loaders,
      };

      let documentAst: DocumentNode;
      try {
        documentAst = parse(query);
      } catch (error) {
        const graphqlError = error instanceof GraphQLError
          ? error
          : new GraphQLError(String(error));
        return { errors: [graphqlError] };
      }

      const validationErrors = validate(
        schema,
        documentAst,
        [depthLimit(MAX_DEPTH)]
      );

      if (validationErrors.length > 0) {
        return { errors: validationErrors };
      }

      const result = await graphql({
        schema,
        source: query,
        variableValues: variables,
        contextValue,
        operationName,
      });
      return result;
    },
  });
};

export default plugin;
