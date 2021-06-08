const { v4: uuidv4 } = require('uuid')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const { parseString } = require('../utils')
const { TABLENAME } = require('../config/dynamodb_config')
const { UserInputError, AuthenticationError } = require('apollo-server')

require('dotenv').config()
const JWT_SECRET = process.env.SECRET_KEY

const login = async (username, password, client) => {
  const user = await findUserByUsername(
    username,
    client,
    { currentUser: 'none' },
  )

  if (!user) {
    throw new AuthenticationError('Invalid username or password')
  }

  const correctPassword = await bcrypt.compare(password, user.password)

  if (!correctPassword) {
    throw new AuthenticationError('Invalid username or password')
  }

  const userForToken = {
    id: user.id,
    username: user.username,
  }

  return { value: jwt.sign(userForToken, JWT_SECRET, { expiresIn: 900 }) }
}

const getAllUsers = (client) => {
  return client
    .scan({ TableName: TABLENAME })
    .promise()
    .then((data) => data.Items)
}

const getUserCount = (client) => {
  return client
    .scan({ TableName: TABLENAME })
    .promise()
    .then((data) => data.Count)
}

const findUserByUsername = (username, client) => {
  const params = {
    TableName: TABLENAME,
    FilterExpression: '#searchUsername = :searchUsername',
    ExpressionAttributeNames: {
      '#searchUsername': 'searchUsername',
    },
    ExpressionAttributeValues: {
      ':searchUsername': username.toLowerCase(),
    },
  }
  return client
    .scan(params)
    .promise()
    .then((data) => data.Items[0])
}

const findUserById = (id, client) => {
  const params = {
    TableName: TABLENAME,
    Key: {
      'id': id,
    },
  }
  return client
    .get(params)
    .promise()
    .then((data) => data.Item)
}

const addNewUser = async (user, client) => {
  const { username, firstname, lastname, password, passwordconf, email } = user
  if (!username || (username.length < 3 || username.length > 16)) {
    throw new UserInputError(
      'Invalid username, minimum length 3, maximum length 16.',
    )
  }
  parseString(username, 3, 16, true)
  parseString(firstname, 1, 50, true)
  parseString(lastname, 1, 50, true)
  parseString(password, 8)
  parseString(passwordconf, 8)

  if (password !== passwordconf) {
    throw new UserInputError(
      'Passwords doesn\'t match',
    )
  }

  const emailRegex = /^([A-Za-z0-9_\-.])+@([A-Za-z0-9_\-.])+\.([A-Za-z]{2,4})$/

  if (!email || !emailRegex.test(email)) {
    throw new UserInputError(
      'Invalid email.',
    )
  }

  const doesExist =
    await findUserByUsername(user.username, client)

  if (doesExist) {
    return null
  }

  const newUser = {
    id: uuidv4(),
    username: user.username,
    firstname: user.firstname,
    lastname: user.lastname,
    email: user.email,
    password: await bcrypt.hash(user.password, 10),
    searchUsername: user.username.toLowerCase(),
    userInfo: {
      location: '',
      gender: '',
      dateOfBirth: '',
      profileLikes: 0,
      bio: '',
      tags: [],
    },
    friendList: [],
  }

  const params = {
    TableName: TABLENAME,
    Item: newUser,
  }

  return client
    .put(params)
    .promise()
    .then(() => newUser)
}

const deleteUserById = (id, client) => {
  const params = {
    TableName: TABLENAME,
    Key: {
      'id': id,
    },
  }

  const user = findUserById(id, client)

  return client
    .delete(params)
    .promise()
    .then(() => user)
}

const updateUserInfo = async (userInfo, client) => {
  const user = await findUserById(userInfo.id, client)

  if (!user) {
    throw new AuthenticationError('User not ')
  }
  const oldInfo = user.userInfo

  const isNull = (oldValue, newValue) =>
    (newValue) ? newValue : (oldValue) ? oldValue : null

  const newUserInfo = {
    location: isNull(oldInfo.location, userInfo.location),
    gender: isNull(oldInfo.gender, userInfo.gender),
    dateOfBirth: isNull(oldInfo.dateOfBirth, userInfo.dateOfBirth),
    bio: isNull(oldInfo.bio, userInfo.bio),
    tags: isNull(oldInfo.tags, userInfo.tags),
  }

  user.userInfo = newUserInfo

  const params = {
    TableName: TABLENAME,
    Key: {
      'id': userInfo.id,
    },
    UpdateExpression: 'set #userInfo = :userInfo',
    ExpressionAttributeNames: { '#userInfo': 'userInfo' },
    ExpressionAttributeValues: { ':userInfo': newUserInfo,
    },
  }

  return client
    .update(params)
    .promise()
    .then(() => user)
    .catch((err) => console.log(err))
}

module.exports = {
  login,
  getAllUsers,
  getUserCount,
  findUserByUsername,
  findUserById,
  addNewUser,
  deleteUserById,
  updateUserInfo,
}
