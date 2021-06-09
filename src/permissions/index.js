const { rule, shield, and, not } = require('graphql-shield')

const isAuthenticated = rule()((_parent, _args, { currentUser }) => {
  return Boolean(currentUser)
})

const isReadingOwnAccount = rule()((_parent, { id }, { currentUser }) => {
  return currentUser.id === id
})

const permissions = shield({
  Query: {
    findUserById: isAuthenticated,
    findUserByUsername: isAuthenticated,
    currentUser: isAuthenticated,
    getAllUsers: isAuthenticated,
    getUserCount: isAuthenticated,
  },
  Mutation: {
    login: not(isAuthenticated),
    addNewUser: not(isAuthenticated),
    deleteUserById: and(isAuthenticated, isReadingOwnAccount),
    updateUserInfo: and(isAuthenticated, isReadingOwnAccount),
    updateUserAccount: and(isAuthenticated, isReadingOwnAccount),
  },
})

module.exports = {
  permissions,
}
