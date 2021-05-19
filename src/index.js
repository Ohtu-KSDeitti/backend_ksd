const { ApolloServer } = require('apollo-server')
const { PORT, typeDefs, resolvers, logger } = require('./config/apollo_config')

const server = new ApolloServer({
  cors: true,
  typeDefs: typeDefs,
  resolvers: resolvers,
  plugins: [logger],
})

server.listen({ port: PORT }).then(({ url }) => {
  console.log(`Server ready at ${url}`)
})
