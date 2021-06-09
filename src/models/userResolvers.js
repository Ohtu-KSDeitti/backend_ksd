const {
  getUserCount,
  getAllUsers,
  findUserByUsername,
  findUserById,
  addNewUser,
  deleteUserById,
  login,
  updateUserInfo,
  updateUserAccount,
} = require('./users')

const { docClient } = require('../config/dynamodb_config')

const getResolvers = (client = docClient) =>
  (
    {
      Query: {
        getUserCount: (_root, _args) =>
          getUserCount(client),
        getAllUsers: (_root, _args) =>
          getAllUsers(client),
        findUserByUsername: (_root, args) =>
          findUserByUsername(args.username, client),
        findUserById: (_root, args) =>
          findUserById(args.id, client),
        currentUser: (_root, _args, context) => {
          return context.currentUser
        },
      },
      Mutation: {
        addNewUser: (_root, args) =>
          addNewUser(args, client),
        deleteUserById: (_root, args) =>
          deleteUserById(args.id, client),
        login: (_root, args) =>
          login(args.username, args.password, client),
        updateUserInfo: (_root, args) =>
          updateUserInfo(args, client),
        updateUserAccount: (_root, args) =>
          updateUserAccount(args, client),
      },
    }
  )

module.exports = { getResolvers }
