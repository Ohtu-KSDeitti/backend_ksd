const {
  getUserCount,
  getAllUsers,
  findUserByUsername,
  findUserById,
  addNewUser,
  deleteUserById,
  login,
} = require('./users')

const resolvers = {
  Query: {
    userCount: () => getUserCount(),
    allUsers: () => getAllUsers(),
    findUser: (_root, args) => findUserByUsername(args.username),
    findUserById: (_root, args) => findUserById(args.id),
  },
  Mutation: {
    addUser: (_root, args) => addNewUser(args),
    deleteUser: (_root, args) => deleteUserById(args.id),
    login: (_root, args) => login(args.username, args.password),
  },
}

module.exports = { resolvers }
