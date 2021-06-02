const {
  getUserCount,
  getAllUsers,
  findUserByUsername,
  findUserById,
  addNewUser,
  deleteUserById,
  login,
} = require('./users')

const { docClient } = require('../config/dynamodb_config')

const getResolvers = (client = docClient) =>
  (
    {
      Query: {
        userCount: () => getUserCount(client),
        allUsers: () => getAllUsers(client),
        findUser: (_root, args) => findUserByUsername(args.username, client),
        findUserById: (_root, args) => findUserById(args.id, client),
      },
      Mutation: {
        addUser: (_root, args) => addNewUser(args, client),
        deleteUser: (_root, args) => deleteUserById(args.id, client),
        login: (_root, args) => login(args.username, args.password, client),
      },
    }
  )

module.exports = { getResolvers }
