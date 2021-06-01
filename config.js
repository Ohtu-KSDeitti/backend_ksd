require('dotenv').config()

const AWS_ACCESS_KEY_ID = process.env.AWS_ACCESS_KEY_ID
const AWS_SECRET_KEY = process.env.AWS_SECRET_KEY
const AWS_REGION = process.env.AWS_REGION

const tableName = () => {
  switch (process.env.NODE_ENV) {
  case 'production':
    return process.env.TABLE
  case 'development':
    return process.env.TABLE_DEV
  case 'test':
    return 'test'
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
  test_config: {
    ...(process.env.MOCK_DYNAMODB_ENDPOINT && {
      endpoint: process.env.MOCK_DYNAMODB_ENDPOINT,
      sslEnabled: false,
      region: 'local',
    }),
  },
}
