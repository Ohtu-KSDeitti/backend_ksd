const { ApolloServer, gql } = require('apollo-server')
const { createTestClient } = require('apollo-server-testing')
const { typeDefs } = require('../src/models/userTypes')
const { getResolvers } = require('../src/models/userResolvers')
const { DELETE_USER, FIND_USER, CREATE_USER } = require('./setup/queries')

const resolvers = getResolvers()

const server = new ApolloServer({
  typeDefs,
  resolvers,
})

const { query, mutate } = createTestClient(server)

describe('User-api general tests', () => {
  beforeEach(async () => {
    await mutate({ mutation: CREATE_USER })
  })

  test('Can create user', async () => {
    const CREATE_USER = gql`
    mutation{
      addNewUser(
          username: "heikki123", 
          password: "bigsikret", 
          passwordconf: "bigsikret",
          firstname: "Heikki",
          lastname: "Paasola",
          email: "heikinoma@com.fi", 
        ){
          firstname,
          lastname,
          username,
          email
      }
    }
    `
    const { data: { addNewUser } } = await mutate({ mutation: CREATE_USER })
    expect(addNewUser).toEqual(
      {
        firstname: 'Heikki',
        lastname: 'Paasola',
        username: 'heikki123',
        email: 'heikinoma@com.fi',
      })
  })

  test('User password is encrypted', async () => {
    const CREATE_USER= gql`
    mutation{
      addNewUser(
          username: "heikki123", 
          password: "bigsikret", 
          passwordconf: "bigsikret",
          firstname: "Heikki",
          lastname: "Paasola",
          email: "heikinoma@com.fi", 
        ){
          password
      }
    }
    `
    const { data: { addNewUser } } = await mutate({ mutation: CREATE_USER })
    expect(addNewUser.password).not.toEqual({ password: 'sikret' })
  })

  test('Can\'t create user with the same email', async () => {
    const CREATE_USER= gql`
    mutation{
      addNewUser(
          username: "juuso23", 
          password: "bigsikret", 
          passwordconf: "bigsikret",
          firstname: "Juuso",
          lastname: "Miettinen",
          email: "jeejee@com.fi", 
        ){
          email
      }
    }
    `
    const data = await mutate({ mutation: CREATE_USER })
    expect(data.errors[0].message).toContain('User already exists!')
  })

  test('findUserByEmail returns user if found', async () => {
    const { data: { findUserByEmail } } = await query({ query: FIND_USER })
    expect(findUserByEmail.email).toEqual('jeejee@com.fi')
  })

  test('findUserByEmail returns null if not found', async () => {
    const FIND_USER = gql`
     query {
      findUserByEmail(email: "kek") {
        id
      }
     }
    `
    const { data: { findUserByEmail } } = await query({ query: FIND_USER })
    expect(findUserByEmail).toEqual(null)
  })

  test('deleteUserById returns deleted user if id exists', async () => {
    const { data: { findUserByEmail } } = await query({ query: FIND_USER })

    const { data: { deleteUserById } } =
      await mutate(
        { mutation: DELETE_USER, variables: { id: findUserByEmail.id } })

    expect(deleteUserById).toEqual(findUserByEmail)
  })

  test('deleteUserById returns null if id doesn\'t exist', async () => {
    const { data: { deleteUserById } } =
      await mutate({ mutation: DELETE_USER, variables: { id: 'jokuIdHehe' } })

    expect(deleteUserById).toEqual(null)
  })
})
