const { v4: uuidv4 } = require('uuid')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const { parseString, parseEmail } = require('../utils')
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
  parseEmail(email)

  if (password !== passwordconf) {
    throw new UserInputError(
      'Passwords doesn\'t match',
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

const updateUserAccount = async (user, client) => {
  const username = user.username
  const firstname = user.firstname
  const lastname = user.lastname
  const email = user.email

  parseString(username, 3, 16, true)
  parseString(firstname, 1, 50, true)
  parseString(lastname, 1, 50, true)
  parseEmail(email)

  const params = {
    TableName: TABLENAME,
    Key: {
      'id': user.id,
    },
    UpdateExpression: `set #username = :username,
    #firstname = :firstname, #lastname = :lastname, #email = :email`,
    ExpressionAttributeNames:
    {
      '#username': 'username',
      '#firstname': 'firstname',
      '#lastname': 'lastname',
      '#email': 'email',
    },
    ExpressionAttributeValues:
    {
      ':username': username,
      ':firstname': firstname,
      ':lastname': lastname,
      ':email': email,
    },
  }

  return client
    .update(params)
    .promise()
    .then(() => true)
    .catch(() => false)
}

const updateUserInfo = async (userInfo, client) => {
  const { location, gender, dateOfBirth, bio, tags } = userInfo

  const newUserInfo = {
    location: location,
    gender: gender,
    dateOfBirth: dateOfBirth,
    bio: bio,
    tags: tags,
  }

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
    .then(() => true)
    .catch(() => false)
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
  updateUserAccount,
}
