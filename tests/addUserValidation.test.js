const { ApolloServer, gql } = require('apollo-server')
const { createTestClient } = require('apollo-server-testing')
const { typeDefs } = require('../src/models/userTypes')
const { getResolvers } = require('../src/models/userResolvers')

const resolvers = getResolvers()

const server = new ApolloServer({
  typeDefs,
  resolvers,
})

const { mutate } = createTestClient(server)

describe('User-api addUser validation tests', () => {
  test('Can\'t create user with too short (< 2) username', async () => {
    const CREATE_USER= gql`
    mutation{
      addNewUser(
          username: "j", 
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
  test('Can\'t create user with too long (> 16) username', async () => {
    const CREATE_USER= gql`
    mutation{
      addNewUser(
          username: "jotainliianpitkaa", 
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
  test('Can\'t create user with too long (> 50) firstname', async () => {
    const CREATE_USER= gql`
    mutation{
      addNewUser(
          username: "jotainliianpitkaa", 
          password: "bigsikret", 
          passwordconf: "bigsikret",
          firstname: "JuusoJuusoJuusoJuusoJuusoJuusoJuusoJuusoJuusoJuuso1",
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
  test('Can\'t create user without firstname', async () => {
    const CREATE_USER= gql`
    mutation{
      addNewUser(
          username: "Mitalisti", 
          password: "bigsikret", 
          passwordconf: "bigsikret",
          firstname: "",
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
  test('Can\'t create user without lastname', async () => {
    const CREATE_USER= gql`
    mutation{
      addNewUser(
          username: "KovaKoo", 
          password: "bigsikret", 
          passwordconf: "bigsikret",
          firstname: "Kyösti",
          lastname: "",
          email: "jeejee@com.fi", 
        ){
          username
      }
    }
    `
    const { data: { addNewUser } } = await mutate({ mutation: CREATE_USER })
    expect(addNewUser).toEqual(null)
  })
  test('Can\'t create user with too long (> 50) lastname', async () => {
    const CREATE_USER= gql`
    mutation{
      addNewUser(
          username: "Jugi", 
          password: "bigsikret", 
          passwordconf: "bigsikret",
          firstname: "Jugi",
          lastname: "JuusoJuusoJuusoJuusoJuusoJuusoJuusoJuusoJuusoJuuso1",
          email: "jeejee@com.fi", 
        ){
          username
      }
    }
    `
    const { data: { addNewUser } } = await mutate({ mutation: CREATE_USER })
    expect(addNewUser).toEqual(null)
  })
  test('Can\'t create user if password do not match passwordconf', async () => {
    const CREATE_USER= gql`
    mutation{
      addNewUser(
          username: "Jugi", 
          password: "bigsikret", 
          passwordconf: "bigsikretti",
          firstname: "Jugi",
          lastname: "Karhu",
          email: "jeejee@com.fi", 
        ){
          username
      }
    }
    `
    const { data: { addNewUser } } = await mutate({ mutation: CREATE_USER })
    expect(addNewUser).toEqual(null)
  })
  test('Can\'t create user if password+conf too short (< 8)', async () => {
    const CREATE_USER= gql`
    mutation{
      addNewUser(
          username: "Jugi", 
          password: "big", 
          passwordconf: "big",
          firstname: "Jugi",
          lastname: "Karhu",
          email: "jeejee@com.fi", 
        ){
          username
      }
    }
    `
    const { data: { addNewUser } } = await mutate({ mutation: CREATE_USER })
    expect(addNewUser).toEqual(null)
  })
  test('Can\'t create user without password', async () => {
    const CREATE_USER= gql`
    mutation{
      addNewUser(
          username: "Jugi", 
          password: "", 
          passwordconf: "tosisalainen2",
          firstname: "Jugi",
          lastname: "Karhu",
          email: "jeejee@com.fi", 
        ){
          username
      }
    }
    `
    const { data: { addNewUser } } = await mutate({ mutation: CREATE_USER })
    expect(addNewUser).toEqual(null)
  })
  test('Can\'t create user without passwordconf', async () => {
    const CREATE_USER= gql`
    mutation{
      addNewUser(
          username: "Jugi", 
          password: "tosisalaistatie", 
          passwordconf: "",
          firstname: "Jugi",
          lastname: "Karhu",
          email: "jeejee@com.fi", 
        ){
          username
      }
    }
    `
    const { data: { addNewUser } } = await mutate({ mutation: CREATE_USER })
    expect(addNewUser).toEqual(null)
  })

  test('Can\'t create user with invalid email', async () => {
    const CREATE_USER= gql`
    mutation{
      addNewUser(
          username: "juuso23", 
          password: "bigsikret", 
          passwordconf: "bigsikret",
          firstname: "Juuso",
          lastname: "Miettinen",
          email: "enannamitäänposteja", 
        ){
          username
      }
    }
    `
    const { data: { addNewUser } } = await mutate({ mutation: CREATE_USER })
    expect(addNewUser).toEqual(null)
  })
  test('Can\'t create user with an emoji in username', async () => {
    const CREATE_USER= gql`
    mutation{
      addNewUser(
          username: "juuso23😰", 
          password: "bigsikret", 
          passwordconf: "bigsikret",
          firstname: "Juuso",
          lastname: "Miettinen",
          email: "enannam@gmail.com"
        ){
          username
      }
    }
    `
    const { data: { addNewUser } } = await mutate({ mutation: CREATE_USER })
    expect(addNewUser).toEqual(null)
  })

  test('Can\'t create user with spaces in username', async () => {
    const CREATE_USER= gql`
    mutation{
      addNewUser(
          username: "juuso23 rulz", 
          password: "bigsikret", 
          passwordconf: "bigsikret",
          firstname: "Juuso",
          lastname: "Miettinen",
          email: "enannam@gmail.com"
        ){
          username
      }
    }
    `
    const { data: { addNewUser } } = await mutate({ mutation: CREATE_USER })
    expect(addNewUser).toEqual(null)
  })
})
