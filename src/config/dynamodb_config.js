const AWS = require('aws-sdk')
const config = require('../../config')

require('dotenv').config()

const ENV = process.env.NODE_ENV

const CONFIG = (ENV === 'test') ?
  config.test_config : config.aws_remote_config

const TABLENAME = config.aws_table_name

const docClient = new AWS.DynamoDB.DocumentClient(CONFIG)

const JWT_SECRET = (ENV === 'test') ? 'test' : process.env.SECRET_KEY

module.exports = {
  TABLENAME,
  docClient,
  JWT_SECRET,
}
