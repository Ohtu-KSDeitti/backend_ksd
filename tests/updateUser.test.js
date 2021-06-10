const { ApolloServer } = require('apollo-server')
const { createTestClient } = require('apollo-server-testing')
const { typeDefs } = require('../src/models/userTypes')
const { getResolvers } = require('../src/models/userResolvers')
const {
  CREATE_USER,
  FIND_USER,
  UPDATE_USER_INFO,
  UPDATE_USER_ACCOUNT,
} = require('./setup/queries')

const resolvers = getResolvers()

const server = new ApolloServer({
  typeDefs,
  resolvers,
})

const { query, mutate } = createTestClient(server)

describe('updateUser tests', () => {
  beforeEach(async () => {
    await mutate({ mutation: CREATE_USER })
  })

  test('updateUserInfo updates info', async () => {
    const { data: { findUserByUsername } } = await query({ query: FIND_USER })

    const expected = {
      gender: 'MALE',
      location: 'Pori',
      dateOfBirth: null,
      status: 'SINGLE',
      bio: null,
      tags: [],
    }

    const { data: { updateUserInfo } } =
      await mutate(
        { mutation: UPDATE_USER_INFO,
          variables: {
            id: findUserByUsername.id,
            gender: 'MALE',
            location: 'Pori',
            dateOfBirth: null,
            status: 'SINGLE',
            bio: null,
            tags: [],
          },
        })

    expect(updateUserInfo).toEqual(expected)
  })

  test('updateUserInfo throws error if gender is wrong', async () => {
    const { data: { findUserByUsername } } = await query({ query: FIND_USER })

    const data =
      await mutate(
        { mutation: UPDATE_USER_INFO,
          variables: {
            id: findUserByUsername.id,
            gender: 'mahtimies',
            location: 'Pori',
            dateOfBirth: null,
            status: 'SINGLE',
            bio: null,
            tags: [],
          },
        })
    expect(data.errors[0].message).toContain('Expected type Gender')
  })

  test('updateUserInfo throws error if status is wrong', async () => {
    const { data: { findUserByUsername } } = await query({ query: FIND_USER })

    const data =
      await mutate(
        { mutation: UPDATE_USER_INFO,
          variables: {
            id: findUserByUsername.id,
            gender: 'MALE',
            location: 'Pori',
            dateOfBirth: null,
            status: 'ei kuulu sulle',
            bio: null,
            tags: [],
          },
        })
    expect(data.errors[0].message).toContain('Expected type Status')
  })

  test('updateUserInfo throws error if dateOfBirth is wrong', async () => {
    const { data: { findUserByUsername } } = await query({ query: FIND_USER })

    const data =
      await mutate(
        { mutation: UPDATE_USER_INFO,
          variables: {
            id: findUserByUsername.id,
            gender: 'MALE',
            location: 'Pori',
            dateOfBirth: '<html> hehe </html>',
            status: 'SINGLE',
            bio: null,
            tags: [],
          },
        })
    expect(data.errors[0].message).toContain('Invalid date form')
  })

  test('updateUserAccount updates account info', async () => {
    const { data: { findUserByUsername } } = await query({ query: FIND_USER })

    const expected = {
      id: findUserByUsername.id,
      username: 'juuso23',
      firstname: 'Jooseppi',
      lastname: 'Miettinen',
      email: 'jeejee@com.fi',
    }

    const { data: { updateUserAccount } } =
      await mutate(
        { mutation: UPDATE_USER_ACCOUNT,
          variables: { ...expected },
        })

    expect(updateUserAccount).toEqual(expected)
  })
})

