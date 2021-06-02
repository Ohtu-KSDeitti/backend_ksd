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

describe('User-api tests', () => {
  beforeEach(async () => {
    const CREATE_USER= gql`
    mutation{
      addUser(
          username: "juuso23", 
          password: "sikret", 
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
      addUser(
          username: "heikki123", 
          password: "sikret", 
          email: "jeejee@com.fi", 
        ){
          username
      }
    }
    `
    const { data: { addUser } } = await mutate({ mutation: CREATE_USER })
    expect(addUser).toEqual({ username: 'heikki123' })
  })

  test('User password is encrypted', async () => {
    const CREATE_USER= gql`
    mutation{
      addUser(
          username: "heikki123", 
          password: "sikret", 
          email: "jeejee@com.fi", 
        ){
          password
      }
    }
    `
    const { data: { addUser } } = await mutate({ mutation: CREATE_USER })
    expect(addUser).not.toEqual({ password: 'sikret' })
  })

  test('Can\'t create user with the same username', async () => {
    const CREATE_USER= gql`
    mutation{
      addUser(
          username: "juuso23", 
          password: "sikret", 
          email: "jeejee@com.fi", 
        ){
          username
      }
    }
    `
    const { data: { addUser } } = await mutate({ mutation: CREATE_USER })
    expect(addUser).toEqual(null)
  })

  test('findUser returns user if found', async () => {
    const FIND_USER = gql`
     query {
      findUser(username: "juuso23") {
        username
      }
     }
    `

    const { data: { findUser } } = await query({ query: FIND_USER })
    expect(findUser).toEqual({ username: 'juuso23' })
  })

  test('findUser returns null if not found', async () => {
    const FIND_USER = gql`
     query {
      findUser(username: "kek") {
        id
      }
     }
    `
    const { data: { findUser } } = await query({ query: FIND_USER })
    expect(findUser).toEqual(null)
  })

  test('deleteUser returns deleted user if id exists', async () => {
    const FIND_USER = gql`
     query {
      findUser(username: "juuso23") {
        id
        username
      }
     }
    `

    const { data: { findUser } } = await query({ query: FIND_USER })

    const DELETE_USER = gql`
    mutation($id: ID!){
      deleteUser(id: $id){
        id
        username
      }
    }
    `

    const { data: { deleteUser } } =
      await mutate({ mutation: DELETE_USER, variables: { id: findUser.id } })

    expect(deleteUser).toEqual(findUser)
  })

  test('deleteUser returns null if id doesn\'t exist', async () => {
    const DELETE_USER = gql`
    mutation($id: ID!){
      deleteUser(id: $id){
        id
        username
      }
    }
    `

    const { data: { deleteUser } } =
      await mutate({ mutation: DELETE_USER, variables: { id: 'jokuIdHehe' } })

    expect(deleteUser).toEqual(null)
  })

  test('updateUserInfo updates info', async () => {
    const FIND_USER = gql`
    query {
     findUser(username: "juuso23") {
       id
       username
     }
    }
   `

    const { data: { findUser } } = await query({ query: FIND_USER })

    const UPDATE_USER_INFO = gql`
    mutation($id: ID!, $firstname: String, $lastname: String){
      updateUserInfo(
        id: $id,
        firstname: $firstname,
        lastname: $lastname
        ){
        userInfo {
          firstname
          lastname
        }
      }
    }
    `

    const { data: { updateUserInfo } } =
      await mutate(
        { mutation: UPDATE_USER_INFO,
          variables:
          {
            id: findUser.id,
            firstname: 'Juuso',
            lastname: 'Eskelinen',
          },
        })

    console.log(updateUserInfo)
    expect(updateUserInfo).toEqual(
      { userInfo: { firstname: 'Juuso', lastname: 'Eskelinen' } })
  })
})


