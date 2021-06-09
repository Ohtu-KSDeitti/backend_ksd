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
    mutation($id: ID!, 
      $dateOfBirth: String,
      $gender: Gender,
      $status: Status,
      $location: String,
      $bio: String,
      $tags: [String]){
      updateUserInfo(
        id: $id,
        gender: $gender
        status: $status
        dateOfBirth: $dateOfBirth
        location: $location
        bio: $bio
        tags: $tags
        ){
          gender
          location
          dateOfBirth
          status
          bio
          tags
        }
    }
    `

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

  test('updateUserAccount updates account info', async () => {
    const FIND_USER = gql`
    query {
     findUserByUsername(
       username: "juuso23"
       ){
       id
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
        ){
          id
          username
          firstname
          lastname
          email
        }
    }
    `

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
