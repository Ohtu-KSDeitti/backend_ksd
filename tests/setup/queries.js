const { gql } = require('apollo-server')

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

const LOGIN = gql`
    mutation($email: String!, $password: String!) {
      login(
        email: $email,
        password: $password
      ) {
        value
      }
    }
`

const UPDATE_USER_INFO = gql`
mutation($id: ID!, 
  $dateOfBirth: String,
  $gender: Gender,
  $status: Status,
  $location: Region,
  $bio: String,
  $tags: [String],
  $prefRegions: [Region]){
  updateUserInfo(
    id: $id,
    gender: $gender
    status: $status
    dateOfBirth: $dateOfBirth
    location: $location
    bio: $bio
    tags: $tags
    prefRegions: $prefRegions
    ){
      gender
      location
      dateOfBirth
      status
      bio
      tags
      prefRegions
    }
}
`
const FIND_USER = gql`
query {
 findUserByEmail(
   email: "jeejee@com.fi"
   ){
   id
   email
 }
}
`

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

const UPDATE_USER_PASSWORD = gql`
mutation($id: ID!, 
  $password: String!, 
  $passwordconf: String!) {
  updateUserPassword(
    id: $id, 
    password: $password, 
    passwordconf: $passwordconf
    ){
    password
  }
}
`
const DELETE_USER = gql`
    mutation($id: ID!){
      deleteUserById(id: $id){
        id
        email
      }
    }
    `

module.exports = {
  CREATE_USER,
  UPDATE_USER_INFO,
  FIND_USER,
  DELETE_USER,
  UPDATE_USER_ACCOUNT,
  UPDATE_USER_PASSWORD,
  LOGIN,
}
