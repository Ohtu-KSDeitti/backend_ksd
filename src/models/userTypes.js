const { gql } = require('apollo-server')

const typeDefs = gql`
type User {
  id: ID!
  username: String!
  firstname: String!
  lastname: String!
  password: String!
  email: String!
  userInfo: UserInfo
  friendList: [Match]
}

type Match { 
   userID: ID
   status: Int
}

type Token {
   value: String
}

type UserInfo {
  location: String
  gender: String
  dateOfBirth: String
  profileLikes: Int
  bio: String
  tags: [String]
}

type Query {
  getUserCount: Int!
  getAllUsers: [User!]!
  findUserByUsername(username: String): User
  findUserById(id: ID!): User
  currentUser: User!
}

type Mutation {
  addNewUser(
    username: String!
    firstname: String!
    lastname: String!
    password: String!
    passwordconf: String!
    email: String!
  ): User
  deleteUserById(
    id: ID!
  ): User
  login(
    username: String!
    password: String!
  ): Token
  updateUserAccount(
    id: ID!
    username: String
    firstname: String
    lastname: String
    email: String
  ): Boolean
  updateUserInfo(
    id: ID!
    location: String
    gender: String
    dateOfBirth: String
    bio: String
    tags: [String]
  ): Boolean
}
`

module.exports = { typeDefs }
