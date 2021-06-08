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

describe('updateUser tests', () => {
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

  test('updateUserInfo updates info', async () => {
    const FIND_USER = gql`
    query {
     findUserByUsername(
       username: "juuso23"
       ){
       id
       username
     }
    }
   `

    const { data: { findUserByUsername } } = await query({ query: FIND_USER })

    const UPDATE_USER_INFO = gql`
    mutation($id: ID!, $gender: String){
      updateUserInfo(
        id: $id,
        gender: $gender
        )
    }
    `

    const { data: { updateUserInfo } } =
      await mutate(
        { mutation: UPDATE_USER_INFO,
          variables:
          {
            id: findUserByUsername.id,
            gender: 'Male',
          },
        })

    expect(updateUserInfo).toEqual(true)
  })

  test('updateUserAccount updates account info', async () => {
    const FIND_USER = gql`
    query {
     findUserByUsername(
       username: "juuso23"
       ){
       id
       username
     }
    }
   `

    const { data: { findUserByUsername } } = await query({ query: FIND_USER })

    const UPDATE_USER_ACCOUNT = gql`
    mutation($id: ID!, 
      $username: String,
      $firstname: String,
      $lastname: String,
      $email: String){
      updateUserAccount(
        id: $id,
        username: $username
        firstname: $firstname
        lastname: $lastname
        email: $email
        )
    }
    `

    const { data: { updateUserAccount } } =
      await mutate(
        { mutation: UPDATE_USER_ACCOUNT,
          variables:
          {
            id: findUserByUsername.id,
            username: 'juuso23',
            firstname: 'Jooseppi',
            lastname: 'Miettinen',
            email: 'jeejee@com.fi',
          },
        })

    expect(updateUserAccount).toEqual(true)
  })
})
