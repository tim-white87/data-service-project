const { mergeSchemas, makeExecutableSchema } = require('apollo-server-lambda');
const messages = require('./services/messages');

let schemas = [messages];

const baseQuery = makeExecutableSchema({
  typeDefs: `
  type Query
  type Mutation
  `
});

module.exports = mergeSchemas({
  schemas: [baseQuery, ...schemas.map(s => s.typeDefs)],
  resolvers: schemas.map(s => s.resolvers)
});
