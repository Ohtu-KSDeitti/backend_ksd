const { ApolloServer } = require('apollo-server')
const { PORT, config } = require('./config/apollo_config')

const server = new ApolloServer(config)

server.listen({ port: PORT }).then(({ url }) => {
  console.log(`user-api <- ready at url: ${url}`)
}).catch((err) => {
  console.log('user-api <- cannot connect to service(s)')
  console.log('user-api <-', err.message)
})
