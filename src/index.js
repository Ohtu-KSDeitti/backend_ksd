const { buildFederatedSchema } = require('@apollo/federation')
const { ApolloServer } = require('apollo-server')
const { PORT } = require('./config/apollo_config')
const { typeDefs } = require('./models/userTypes')
const { getResolvers } = require('./models/userResolvers')

const resolvers = getResolvers()

const server = new ApolloServer({
  schema: buildFederatedSchema([
    {
      typeDefs,
      resolvers,
    },
  ]),
  plugins: [
    {
      requestDidStart: ( requestContext ) => {
        if ( requestContext.request.http?.headers.has( 'x-apollo-tracing' ) ) {
          return
        }
        const query =
          requestContext.request.query?.replace( /\s+/g, ' ' ).trim()
        const variables = JSON.stringify( requestContext.request.variables )
        console.log('user-api <-',
          new Date().toISOString(),
          `- [Request Started] { query: ${ query }, 
          variables: ${ variables }, 
          operationName: ${ requestContext.request.operationName } }` )
        return
      },
    },
  ],
})

server.listen({ port: PORT }).then(({ url }) => {
  console.log(`user-api <- ready at url: ${url}`)
}).catch((err) => {
  console.log('user-api <- cannot connect to service(s)')
  console.log('user-api <-', err.message)
})
