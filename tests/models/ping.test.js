const { ApolloServer, gql } = require('apollo-server')
const { createTestClient } = require('apollo-server-testing')
const { pingDefs, pingRes } = require('../../src/models/ping/ping')

const server = new ApolloServer({
  typeDefs: pingDefs,
  resolvers: pingRes,
})

describe('Ping tests', () => {
  const { query } = createTestClient(server)

  test('query pings returns all pings', async () => {
    const GET_ALL_PINGS = gql`
     query {
      pings {
        ping
        }
     }
    `

    const { data: { pings } } = await query({ query: GET_ALL_PINGS })

    expect(pings).toEqual(
      [{ ping: 'pong' }, { ping: 'kong' }],
    )
  })
})
