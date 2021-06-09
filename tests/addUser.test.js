const { ApolloServer, gql } = require('apollo-server')
const { createTestClient } = require('apollo-server-testing')
const { typeDefs } = require('../src/models/userTypes')
const { getResolvers } = require('../src/models/userResolvers')

const resolvers = getResolvers()

const server = new ApolloServer({
  typeDefs,
  resolvers,
})

const { query, mutate } = createTestClient(server)

describe('User-api general tests', () => {
  beforeEach(async () => {
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
          username
      }
    }
    `
    await mutate({ mutation: CREATE_USER })
  })

  test('Can create user', async () => {
    const CREATE_USER= gql`
    mutation{
      addNewUser(
          username: "heikki123", 
          password: "bigsikret", 
          passwordconf: "bigsikret",
          firstname: "Heikki",
          lastname: "Paasola",
          email: "jeejee@com.fi", 
        ){
          firstname,
          lastname,
          username
      }
    }
    `
    const { data: { addNewUser } } = await mutate({ mutation: CREATE_USER })
    expect(addNewUser).toEqual(
      {
        firstname: 'Heikki',
        lastname: 'Paasola',
        username: 'heikki123',
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
          email: "jeejee@com.fi", 
        ){
          password
      }
    }
    `
    const { data: { addNewUser } } = await mutate({ mutation: CREATE_USER })
    expect(addNewUser.password).not.toEqual({ password: 'sikret' })
  })

  test('Can\'t create user with the same username', async () => {
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
          username
      }
    }
    `
    const { data: { addNewUser } } = await mutate({ mutation: CREATE_USER })
    expect(addNewUser).toEqual(null)
  })

  test('findUserByUsername returns user if found', async () => {
    const FIND_USER = gql`
     query {
      findUserByUsername(username: "juuso23") {
        username
      }
     }
    `

    const { data: { findUserByUsername } } = await query({ query: FIND_USER })
    expect(findUserByUsername).toEqual({ username: 'juuso23' })
  })

  test('findUserByUsername returns null if not found', async () => {
    const FIND_USER = gql`
     query {
      findUserByUsername(username: "kek") {
        id
      }
     }
    `
    const { data: { findUserByUsername } } = await query({ query: FIND_USER })
    expect(findUserByUsername).toEqual(null)
  })

  test('deleteUserById returns deleted user if id exists', async () => {
    const FIND_USER = gql`
     query {
      findUserByUsername(username: "juuso23") {
        id
        username
      }
     }
    `

    const { data: { findUserByUsername } } = await query({ query: FIND_USER })

    const DELETE_USER = gql`
    mutation($id: ID!){
      deleteUserById(id: $id){
        id
        username
      }
    }
    `

    const { data: { deleteUserById } } =
      await mutate(
        { mutation: DELETE_USER, variables: { id: findUserByUsername.id } })

    expect(deleteUserById).toEqual(findUserByUsername)
  })

  test('deleteUserById returns null if id doesn\'t exist', async () => {
    const DELETE_USER = gql`
    mutation($id: ID!){
      deleteUserById(id: $id){
        id
        username
      }
    }
    `

    const { data: { deleteUserById } } =
      await mutate({ mutation: DELETE_USER, variables: { id: 'jokuIdHehe' } })

    expect(deleteUserById).toEqual(null)
  })
})
