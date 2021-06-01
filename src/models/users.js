
const { v4: uuidv4 } = require('uuid')
const bcrypt = require('bcrypt')
const { TABLENAME } = require('../config/dynamodb_config')

const login = async (username, password, client) => {
  const user = await findUserByUsername(username, client)

  const pswdCorrect = user === null ?
    false :
    await bcrypt.compare(password, user.password)

  const value = {
    value: (pswdCorrect) ? 'OK' : '',
  }
  return value
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
  const doesExist = await findUserByUsername(user.username, client)

  if (doesExist) {
    return null
  }

  const newUser = {
    id: uuidv4(),
    ...user,
    password: await bcrypt.hash(user.password, 10),
    searchUsername: user.username.toLowerCase(),
    userInfo: {
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

  const User = findUserById(id, client)

  return client
    .delete(params)
    .promise()
    .then(() => User)
}

module.exports = {
  login,
  getAllUsers,
  getUserCount,
  findUserByUsername,
  findUserById,
  addNewUser,
  deleteUserById,
}
