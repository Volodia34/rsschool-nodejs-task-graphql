import { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox';
import { createGqlResponseSchema, gqlResponseSchema } from './schemas.js';
import { GraphQLSchema, graphql } from 'graphql';
import { schema } from './schema.js';
import { GraphQLContext } from './common/GraphQLContext.js';

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
      const { query, variables } = req.body;
      const contextValue: GraphQLContext = {
        prisma: fastify.prisma,
        fastify: fastify,
      };

      const result = await graphql({
        schema: schema,
        source: query,
        variableValues: variables,
        contextValue,
      });
      return result;
    },
  });
};

export default plugin;
