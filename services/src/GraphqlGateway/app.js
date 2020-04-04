const { ApolloServer, gql } = require('apollo-server-lambda');
const schema = require('./src/schema');

const server = new ApolloServer({ schema, playground: true });

exports.graphqlHandler = server.createHandler();
