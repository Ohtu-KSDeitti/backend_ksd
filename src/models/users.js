const AWS = require('aws-sdk')
const config = require('../../config')
const { v4: uuidv4 } = require('uuid')
const bcrypt = require('bcrypt')

AWS.config.update(config.aws_remote_config)

const TABLENAME = config.aws_table_name

const docClient = new AWS.DynamoDB.DocumentClient()

const login = async (username, password) => {
  const user = await findUserByUsername(username)

  const pswdCorrect = user === null ?
    false :
    await bcrypt.compare(password, user.password)

  const value = {
    value: (pswdCorrect) ? 'OK' : '',
  }
  return value
}

const getAllUsers = () => {
  return docClient
    .scan({ TableName: TABLENAME })
    .promise()
    .then((data) => data.Items)
}

const getUserCount = () => {
  return docClient
    .scan({ TableName: TABLENAME })
    .promise()
    .then((data) => data.Count)
}


const findUserByUsername = (username) => {
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
  return docClient
    .scan(params)
    .promise()
    .then((data) => data.Items[0])
}

const findUserById = (id) => {
  const params = {
    TableName: TABLENAME,
    Key: {
      'id': id,
    },
  }
  return docClient
    .get(params)
    .promise()
    .then((data) => data.Item)
}

const addNewUser = async (user) => {
  const doesExist = await findUserByUsername(user.username)

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

  return docClient
    .put(params)
    .promise()
    .then(() => newUser)
}

const deleteUserById = (id) => {
  const params = {
    TableName: TABLENAME,
    Key: {
      'id': id,
    },
  }

  const User = findUserById(id)

  return docClient
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
