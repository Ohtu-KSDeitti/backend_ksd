require('dotenv').config()

const AWS_ACCESS_KEY_ID = process.env.AWS_ACCESS_KEY_ID
const AWS_SECRET_KEY = process.env.AWS_SECRET_KEY
const AWS_REGION = process.env.AWS_REGION

require('dotenv').config()

const tableName = () => {
  switch (process.env.NODE_ENV) {
  case 'production':
    return process.env.TABLE
  case 'development':
    return process.env.TABLE_DEV
  case 'test':
    return process.env.TABLE_TEST
  default:
    return process.env.TABLE_DEV
  }
}

module.exports = {
  aws_table_name: tableName(),
  aws_remote_config: {
    accessKeyId: AWS_ACCESS_KEY_ID,
    secretAccessKey: AWS_SECRET_KEY,
    region: AWS_REGION,
  },
}
