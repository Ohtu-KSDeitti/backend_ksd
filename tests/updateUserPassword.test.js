const { ApolloServer } = require('apollo-server')
const { createTestClient } = require('apollo-server-testing')
const { typeDefs } = require('../src/models/userTypes')
const { getResolvers } = require('../src/models/userResolvers')
const {
  CREATE_USER,
  FIND_USER,
  UPDATE_USER_PASSWORD,
} = require('./setup/queries')

const resolvers = getResolvers()

const server = new ApolloServer({
  typeDefs,
  resolvers,
})

const { query, mutate } = createTestClient(server)

describe('updateUserPassword tests', () => {
  beforeEach(async () => {
    await mutate({ mutation: CREATE_USER })
  })

  test('password updates succesfully', async () => {
    const { data: { findUserByUsername } } = await query({ query: FIND_USER })

    const data =
      await mutate(
        { mutation: UPDATE_USER_PASSWORD,
          variables: {
            id: findUserByUsername.id,
            password: 'bigkekeke',
            passwordconf: 'bigkekeke',
          },
        })

    expect(data.errors).toBe(undefined)
  })

  test('password doesn\'t change if they don\'t match', async () => {
    const { data: { findUserByUsername } } = await query({ query: FIND_USER })

    const data =
      await mutate(
        { mutation: UPDATE_USER_PASSWORD,
          variables: {
            id: findUserByUsername.id,
            password: 'bigkekeke',
            passwordconf: 'hahahaha',
          },
        })

    expect(data.errors[0].message).toContain('Passwords doesn\'t match')
  })
})

