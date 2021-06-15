const { ApolloServer } = require('apollo-server')
const { createTestClient } = require('apollo-server-testing')
const { typeDefs } = require('../src/models/userTypes')
const { getResolvers } = require('../src/models/userResolvers')
const { CREATE_USER, LOGIN } = require('./setup/queries')

const resolvers = getResolvers()

const server = new ApolloServer({
  typeDefs,
  resolvers,
})

const { mutate } = createTestClient(server)

describe('User-api general tests', () => {
  beforeEach(async () => {
    await mutate({ mutation: CREATE_USER })
  })

  test('Login doesn\'t throw error if password is correct', async () => {
    const data = await mutate(
      { mutation: LOGIN,
        variables: { email: 'jeejee@com.fi', password: 'bigsikret' },
      })

    expect(data.errors).toBe(undefined)
  })

  test('Login throws error if password is incorrect', async () => {
    const data = await mutate(
      { mutation: LOGIN,
        variables: { email: 'jeejee@com.fi', password: 'agesgsge' },
      })

    expect(data.errors[0].message).toContain('Invalid email or password')
  })

  test('Login throws error if email is incorrect', async () => {
    const data = await mutate(
      { mutation: LOGIN,
        variables: { email: 'hahaha@com.fi', password: 'bigsikret' },
      })

    expect(data.errors[0].message).toContain('Invalid email or password')
  })
})
