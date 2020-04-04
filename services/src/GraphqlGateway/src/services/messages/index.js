const { gql } = require('apollo-server-lambda');

const typeDefs = gql`
  extend type Query {
    message: Message
    messages: [Message]
  }

  extend type Mutation {
    createMessage: Message
  }

  type Message {
    id: ID
    isRead: Boolean
    text: String
    title: String
  }
`;

const resolvers = {
  Query: {
    message: () => {
      return {};
    },
    messages: () => {}
  }
};

module.exports = { typeDefs, resolvers };
