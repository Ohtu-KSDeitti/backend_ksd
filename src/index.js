const { ApolloServer } = require('apollo-server')
const { typeDefs, resolvers } = require('./config/apollo_config')

const server = new ApolloServer({
  cors: true,
  typeDefs: typeDefs,
  resolvers: resolvers,
})

server.listen().then(({ url }) => {
  console.log(`Server ready at ${url}`)
})
