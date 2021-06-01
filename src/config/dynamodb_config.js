const AWS = require('aws-sdk')
const config = require('../../config')

const CONFIG = process.env.NODE_ENV === 'test' ?
  config.test_config : config.aws_remote_config

const TABLENAME = config.aws_table_name

const docClient = new AWS.DynamoDB.DocumentClient(CONFIG)

module.exports = {
  TABLENAME,
  docClient,
}
