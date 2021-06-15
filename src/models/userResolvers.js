const {
  getUserCount,
  getAllUsers,
  findUserByEmail,
  findUserById,
  addNewUser,
  deleteUserById,
  login,
  updateUserInfo,
  updateUserAccount,
  updateUserPassword,
} = require('./users')

const getResolvers = () =>
  (
    {
      Query: {
        getUserCount: (_root, _args) =>
          getUserCount(),
        getAllUsers: (_root, _args) =>
          getAllUsers(),
        findUserByEmail: (_root, args) =>
          findUserByEmail(args.email),
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
        updateUserPassword: (_root, args) =>
          updateUserPassword(args),
      },
    }
  )

module.exports = { getResolvers }
