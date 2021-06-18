const { ApolloServer } = require('apollo-server')
const { createTestClient } = require('apollo-server-testing')
const { typeDefs } = require('../src/models/userTypes')
const { getResolvers } = require('../src/models/userResolvers')
const {
  CREATE_USER,
  FIND_USER,
  UPDATE_USER_INFO,
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

  test('updateUserInfo updates info with few fields', async () => {
    const { data: { findUserByEmail } } = await query({ query: FIND_USER })

    const expected = {
      gender: 'MALE',
      location: 'AHVENANMAA',
      dateOfBirth: null,
      status: 'SINGLE',
      bio: null,
      tags: [],
    }

    const { data: { updateUserInfo } } =
      await mutate(
        { mutation: UPDATE_USER_INFO,
          variables: {
            id: findUserByEmail.id,
            gender: 'MALE',
            location: 'AHVENANMAA',
            dateOfBirth: null,
            status: 'SINGLE',
            bio: null,
            tags: [],
          },
        })

    expect(updateUserInfo).toEqual(expected)
  })

  test('updateUserInfo updates userInfo', async () => {
    const { data: { findUserByEmail } } = await query({ query: FIND_USER })

    const expected = {
      gender: 'MALE',
      location: 'AHVENANMAA',
      dateOfBirth: '1998-11-11',
      status: 'SINGLE',
      bio: 'Tykkään ruokahetkistä perheen kanssa',
      tags: [],
    }

    const { data: { updateUserInfo } } =
      await mutate(
        { mutation: UPDATE_USER_INFO,
          variables: { id: findUserByEmail.id, ...expected },
        })

    expect(updateUserInfo).toEqual(expected)
  })

  test('updateUserInfo throws error if gender is wrong', async () => {
    const { data: { findUserByEmail } } = await query({ query: FIND_USER })

    const data =
      await mutate(
        { mutation: UPDATE_USER_INFO,
          variables: {
            id: findUserByEmail.id,
            gender: 'mahtimies',
            location: 'AHVENANMAA',
            dateOfBirth: null,
            status: 'SINGLE',
            bio: null,
            tags: [],
          },
        })
    expect(data.errors[0].message).toContain('Expected type Gender')
  })

  test('updateUserInfo throws error if location is wrong', async () => {
    const { data: { findUserByEmail } } = await query({ query: FIND_USER })

    const data =
      await mutate(
        { mutation: UPDATE_USER_INFO,
          variables: {
            id: findUserByEmail.id,
            gender: 'MALE',
            location: 'Mä asun missä mä haluun',
            dateOfBirth: null,
            status: 'SINGLE',
            bio: null,
            tags: [],
          },
        })
    expect(data.errors[0].message).toContain('Expected type Region.')
  })

  test('updateUserInfo throws error if status is wrong', async () => {
    const { data: { findUserByEmail } } = await query({ query: FIND_USER })

    const data =
      await mutate(
        { mutation: UPDATE_USER_INFO,
          variables: {
            id: findUserByEmail.id,
            gender: 'MALE',
            location: 'AHVENANMAA',
            dateOfBirth: null,
            status: 'ei kuulu sulle',
            bio: null,
            tags: [],
          },
        })
    expect(data.errors[0].message).toContain('Expected type Status')
  })

  test('updateUserInfo throws error if dateOfBirth is wrong', async () => {
    const { data: { findUserByEmail } } = await query({ query: FIND_USER })

    const data =
      await mutate(
        { mutation: UPDATE_USER_INFO,
          variables: {
            id: findUserByEmail.id,
            gender: 'MALE',
            location: 'AHVENANMAA',
            dateOfBirth: '<html> hehe </html>',
            status: 'SINGLE',
            bio: null,
            tags: [],
          },
        })
    expect(data.errors[0].message).toContain('Invalid date form')
  })

  test('updateUserInfo updates userInfo', async () => {
    const { data: { findUserByEmail } } = await query({ query: FIND_USER })

    const expected = {
      gender: 'MALE',
      location: 'AHVENANMAA',
      dateOfBirth: '1998-11-11',
      status: 'SINGLE',
      bio: 'Tykkään ruokahetkistä perheen kanssa',
      tags: [],
    }

    const { data: { updateUserInfo } } =
      await mutate(
        { mutation: UPDATE_USER_INFO,
          variables: { id: findUserByEmail.id, ...expected },
        })

    expect(updateUserInfo).toEqual(expected)
  })

  test('updateUserInfo doesn\'t update info if bio is over 500', async () => {
    const { data: { findUserByEmail } } = await query({ query: FIND_USER })

    const expected = {
      gender: 'MALE',
      location: 'AHVENANMAA',
      dateOfBirth: '1998-11-11',
      status: 'SINGLE',
      bio: `Donec in elementum sem, eu maximus neque. 
      Suspendisse sit amet velit purus. 
      Pellentesque imperdiet luctus metus sit amet suscipit. 
      Cras elementum nulla id orci vulputate consequat. 
      Etiam fringilla, sem nec semper gravida, 
      felis nibh suscipit mi, quis lacinia orci lorem vel leo. 
      Duis faucibus vehicula hendrerit. Morbi tempor gravida purus. 
      Donec in elementum sem, eu maximus neque. 
      Suspendisse sit amet velit purus. 
      Pellentesque imperdiet luctus metus sit amet suscipit. 
      Cras elementum nulla id orci vulputate consequat. 
      Etiam fringilla, sem nec semper gravida, 
      felis nibh suscipit mi, quis lacinia orci lorem vel leo. 
      Duis faucibus vehicula hendrerit. Morbi tempor gravida purus. `,
      tags: [],
    }

    const data =
      await mutate(
        { mutation: UPDATE_USER_INFO,
          variables: { id: findUserByEmail.id, ...expected },
        })

    expect(data.errors[0].message).toContain('Bio accepts only')
  })
})

