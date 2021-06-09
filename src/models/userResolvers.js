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

const getResolvers = () =>
  (
    {
      Query: {
        getUserCount: (_root, _args) =>
          getUserCount(),
        getAllUsers: (_root, _args) =>
          getAllUsers(),
        findUserByUsername: (_root, args) =>
          findUserByUsername(args.username),
        findUserById: (_root, args) =>
          findUserById(args.id),
        currentUser: (_root, _args, context) => {
          return context.currentUser
        },
      },
      Mutation: {
        addNewUser: (_root, args) =>
          addNewUser(args),
        deleteUserById: (_root, args) =>
          deleteUserById(args.id),
        login: (_root, args) =>
          login(args.username, args.password),
        updateUserInfo: (_root, args) =>
          updateUserInfo(args),
        updateUserAccount: (_root, args) =>
          updateUserAccount(args),
      },
    }
  )

module.exports = { getResolvers }
