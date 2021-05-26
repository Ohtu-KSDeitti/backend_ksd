const { gql } = require('apollo-server')

const userList = [
  {
    id: 123,
    username: 'k0psutin',
    name: 'jani',
    password: 'asdf983012',
  },
  {
    id: 133,
    username: 'kek',
    name: 'lul',
    password: 'pallo123',
  },
]

module.exports.typeDefs = gql`
   type User {
     id: ID!
     username: String!
     password: String!
     name: String!
   }

   type Query {
     userCount: Int!
     allUsers: [User!]!
     findUser(name: String!): User
   }
`

module.exports.resolvers = {
  Query: {
    userCount: () => userList.length,
    allUsers: () => userList,
    findUser: (_root, args) => userList.find((user) => user.name === args.name),
  },
}
