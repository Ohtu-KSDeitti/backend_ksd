const { ApolloServer } = require('apollo-server')
const {
  PORT, typeDefs, resolvers, logger,
} = require('./config/apollo_config')

const server = new ApolloServer({
  cors: true,
  typeDefs,
  resolvers,
  plugins: [logger],
})

server.listen({ port: PORT }).then(({ url }) => {
  // eslint-disable-next-line no-console
  console.log(`Server ready at ${url}`)
})
