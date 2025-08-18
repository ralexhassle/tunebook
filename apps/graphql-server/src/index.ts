import { createServer } from '@graphql-yoga/node';
import { normalizeTunes, RawTune } from '@tunebook/data-processing';

const rawTunes: RawTune[] = [
  { id: 1, name: 'The Kesh', type: 'jig' },
  { id: 2, name: 'Drowsy Maggie', type: 'reel' }
];

const tunes = normalizeTunes(rawTunes);

const typeDefs = /* GraphQL */ `
  type Tune {
    thesession_id: Int!
    title: String!
    type: String!
    meter: String
    mode: String
    key: String
  }

  type Query {
    tunes(type: String): [Tune!]!
  }
`;

const resolvers = {
  Query: {
    tunes: (_: unknown, args: { type?: string }) => {
      return args.type ? tunes.filter(t => t.type === args.type) : tunes;
    }
  }
};

const server = createServer({ schema: { typeDefs, resolvers } });

server.start().then(() => {
  console.log('🎵 GraphQL server running on http://localhost:4000/graphql');
});
