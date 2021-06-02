const {
  getUserCount,
  getAllUsers,
  findUserByUsername,
  findUserById,
  addNewUser,
  deleteUserById,
  login,
  updateUserInfo,
} = require('./users')

const { docClient } = require('../config/dynamodb_config')

const getResolvers = (client = docClient) =>
  (
    {
      Query: {
        userCount: () => getUserCount(client),
        allUsers: (_root, _args) => getAllUsers(client),
        findUser: (_root, args) => findUserByUsername(args.username, client),
        findUserById: (_root, args) => findUserById(args.id, client),
        currentUser: (_root, _args, context) => {
          return context.currentUser
        },
      },
      Mutation: {
        addUser: (_root, args) => addNewUser(args, client),
        deleteUser: (_root, args) => deleteUserById(args.id, client),
        login: (_root, args) => login(args.username, args.password, client),
        updateUserInfo: (_root, args) => updateUserInfo(args, client),
      },
    }
  )

module.exports = { getResolvers }
