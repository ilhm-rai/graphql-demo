const { ApolloServer, PubSub } = require('apollo-server');
const gql = require('graphql-tag');
const fs = require('fs');
const path = require('path');
const { PrismaClient } = require('@prisma/client');
const { getUserId } = require('./utils');
const Query = require('./resolvers/Query');
const Mutation = require('./resolvers/Mutation');
const Subscription = require('./resolvers/Subscription');
const User = require('./resolvers/User');
const Link = require('./resolvers/Link');
const Vote = require('./resolvers/Vote');

const typeDefs = gql`
  type Query {
    info: String!
    feed: [Link!]!
  }

  type Mutation {
    post(ur: String!, description: String!): Link!
  }

  type Link {
    id: ID!
    description: String!
    url: String!
  }
`;

let links = [
  {
    id: 'link-0',
    url: 'www.howtographql.com',
    description: 'Fullstack tutorial for GraphQL',
  },
];

// const resolvers = {
//   Query: {
//     info: () => `This is the API of a Hackernews Clone`,
//     feed: (parent, args, context) => {
//       return context.prisma.link.findMany();
//     },
//     link: (parent, args, context) => {
//       return context.prisma.link.findFirst({
//         where: {
//           id: +args.id,
//         },
//       });
//     },
//   },
//   Mutation: {
//     post: (parent, args, context, info) => {
//       const newLink = context.prisma.link.create({
//         data: {
//           url: args.url,
//           description: args.description,
//         },
//       });
//       return newLink;
//     },
//     updateLink: (parent, args, context, info) => {
//       return context.prisma.link.update({
//         where: { id: +args.id },
//         data: {
//           url: args.url,
//           description: args.description,
//         },
//       });
//     },
//     deleteLink: (parent, args, context, info) => {
//       return context.prisma.link.delete({
//         where: {
//           id: +args.id,
//         },
//       });
//     },
//   },
//   // Each level of nesting corresponds to one resolver execution level.
//   // Link: {
//   //   id: (parent) => parent.id,
//   //   description: (parent) => parent.description,
//   //   url: (parent) => parent.url,
//   // },
// };

const resolvers = {
  Query,
  Mutation,
  Subscription,
  User,
  Link,
  Vote,
};

const prisma = new PrismaClient();
const pubsub = new PubSub();

const server = new ApolloServer({
  typeDefs: fs.readFileSync(path.join(__dirname, 'schema.graphql'), 'utf-8'),
  resolvers,
  context: ({ req }) => {
    return {
      ...req,
      prisma,
      pubsub,
      userId: req && req.headers.authorization ? getUserId(req) : null,
    };
  },
});

server.listen().then(({ url }) => console.log(`Server is running on ${url}`));
