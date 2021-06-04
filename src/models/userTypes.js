const { gql } = require('apollo-server')

const typeDefs = gql`
type User {
  id: ID!
  username: String!
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
  firstname: String
  lastname: String
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
    password: String!
    email: String!
  ): User
  deleteUserById(
    id: ID!
  ): User
  login(
    username: String!
    password: String!
  ): Token
  updateUserInfo(
    id: ID!
    firstname: String
    lastname: String
    location: String
    gender: String
    dateOfBirth: String
    bio: String
    tags: [String]
  ): User
}
`

module.exports = { typeDefs }
