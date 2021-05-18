const { ApolloServer, gql } = require('apollo-server')
const { merge } = require('lodash')

/* Esimerkkinä kovakoodattu tietokantataulu ping

Myöhemmin taulujen määritelmät src/models jne?
*/
const pingDefs = gql`
    type Ping {
        ping: String
    }

    type Query {
        pings: [Ping]
    }
`

const pings = [
  {
    ping: 'pong',
  },
]

const pingRes = {
  Query: {
    pings: () => pings,
  },
}

const server = new ApolloServer({
  typeDefs: [pingDefs],
  resolvers: merge(pingRes),
})

server.listen().then(({ url }) => {
  console.log(`Server ready at ${url}`)
})
