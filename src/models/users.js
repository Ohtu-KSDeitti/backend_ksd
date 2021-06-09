const { v4: uuidv4 } = require('uuid')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const { parseString, parseEmail, encrypt, decrypt } = require('../utils')
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
    .then((data) => {
      return data.Items.map((user) => {
        user.firstname = decrypt(user.firstname)
        user.lastname = decrypt(user.lastname)
        user.email = decrypt(user.email)
        user.userInfo.location = decrypt(user.userInfo.location)
        user.userInfo.dateOfBirth = decrypt(user.userInfo.dateOfBirth)
        return user
      })
    })
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
    .then((data) => {
      const user = data.Items[0]
      if (!user) {
        return null
      }
      user.firstname = decrypt(user.firstname)
      user.lastname = decrypt(user.lastname)
      user.email = decrypt(user.email)
      user.userInfo.location = decrypt(user.userInfo.location)
      user.userInfo.dateOfBirth = decrypt(user.userInfo.dateOfBirth)
      return user
    })
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
    .then((data) => {
      const user = data.Item
      if (!user) {
        return null
      }
      user.firstname = decrypt(user.firstname)
      user.lastname = decrypt(user.lastname)
      user.email = decrypt(user.email)
      user.userInfo.location = decrypt(user.userInfo.location)
      user.userInfo.dateOfBirth = decrypt(user.userInfo.dateOfBirth)
      return user
    })
}

const addNewUser = async (user, client) => {
  const { username, firstname, lastname, password, passwordconf, email } = user
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
    await findUserByUsername(username, client)

  if (doesExist) {
    return null
  }

  const newUser = {
    id: uuidv4(),
    username: user.username,
    firstname: encrypt(user.firstname),
    lastname: encrypt(user.lastname),
    email: encrypt(user.email),
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

  const returnUser =
  { ...newUser,
    firstname: user.firstname,
    lastname: user.lastname,
    email: user.email,
  }

  return client
    .put(params)
    .promise()
    .then(() => returnUser)
}

const deleteUserById = async (id, client) => {
  const params = {
    TableName: TABLENAME,
    Key: {
      'id': id,
    },
  }

  const user = await findUserById(id, client)

  return client
    .delete(params)
    .promise()
    .then(() => user)
}

const updateUserAccount = (user, client) => {
  const username = user.username
  const firstname = user.firstname
  const lastname = user.lastname
  const email = user.email

  const oldUser = findUserById(user.id, client)

  if (!oldUser) {
    throw new Error({ message: 'User not found' })
  }

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
      ':firstname': encrypt(firstname),
      ':lastname': encrypt(lastname),
      ':email': encrypt(email),
    },
  }

  return client
    .update(params)
    .promise()
    .then(() => user)
}

const updateUserInfo = (userInfo, client) => {
  const { location, gender, dateOfBirth, bio, tags, status } = userInfo

  const newUserInfo = {
    location: encrypt(location),
    gender: gender,
    dateOfBirth: encrypt(dateOfBirth),
    status: status,
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
    .then(() => userInfo)
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
