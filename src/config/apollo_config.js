const { buildFederatedSchema } = require('@apollo/federation')
const { findUserById } = require('../models/users')
const { docClient } = require('./dynamodb_config')
const { typeDefs } = require('../models/userTypes')
const { getResolvers } = require('../models/userResolvers')
const jwt = require('jsonwebtoken')
const { AuthenticationError } = require('apollo-server')

const resolvers = getResolvers()

require('dotenv').config()

const PORT = process.env.PORT
const JWT_SECRET = process.env.SECRET_KEY
const ENV = process.env.NODE_ENV
const config = {
  schema: buildFederatedSchema([
    {
      typeDefs,
      resolvers,
    },
  ]),
  context: async ({ req }) => {
    const auth = req.body.variables.authorization || null
    const login = (req.body.operationName === 'login' ||
    req.body.operationName === 'addUser')

    if (auth && auth.toLowerCase().startsWith('bearer')) {
      const decodedToken = jwt.verify(
        auth.substring(7), JWT_SECRET,
      )
      console.log(decodedToken.id)
      const currentUser = await findUserById(decodedToken.id, docClient)
      if (!currentUser) {
        throw new AuthenticationError('User not logged in!')
      }
      console.log(currentUser)
      return { currentUser }
    }
    if (!login) {
      throw new AuthenticationError('Unauthorized token!')
    }
  },
  plugins: [
    {
      requestDidStart: ( requestContext ) => {
        if ( requestContext.request.http?.headers.has( 'x-apollo-tracing' ) ) {
          return
        }
        if (ENV !== 'production') {
          const query =
        requestContext.request.query?.replace( /\s+/g, ' ' ).trim()
          const variables = JSON.stringify( requestContext.request.variables )
          console.log('user-api <-', new Date().toISOString())
          console.log('user-api <-', `- [Request Started] { query: ${ query }`)
          console.log('user-api <-', 'variables:', variables)
          console.log('user-api <-',
            'operationName:',
            requestContext.request.operationName)
          return
        }
      },
    },
  ],
}

module.exports = {
  PORT,
  config,
}
