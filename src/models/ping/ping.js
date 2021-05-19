const { gql } = require('apollo-server')

module.exports.pingDefs = gql`
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

module.exports.pingRes = {
  Query: {
    pings: () => pings,
  },
}


