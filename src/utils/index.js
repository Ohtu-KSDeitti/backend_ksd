const { UserInputError } = require('apollo-server')
const crypto = require('crypto')

require('dotenv').config()

const JWT_SECRET = process.env.SECRET_KEY
const ENV = process.env.NODE_ENV

const parseString = (str, min, max = 99, unicode = false) => {
  const length = str.length

  if (unicode) {
    if (hasUnicodeChar(str)) {
      throw new UserInputError(
        `Invalid ${str}, contains unicode charachters.`,
      )
    }
  }

  if (length < min || length > max) {
    throw new UserInputError(
      `Invalid ${str}, minimum length ${min}, maximum length ${max}.`,
    )
  }
}

// Accepts only [A-Z,a-z,0-9]+
const hasUnicodeChar = (str) => {
  return /\W+/.test(str)
}

const parseEmail = (str) => {
  const emailRegex = /^([A-Za-z0-9_\-.])+@([A-Za-z0-9_\-.])+\.([A-Za-z]{2,4})$/

  if (!str || !emailRegex.test(str)) {
    throw new UserInputError(
      'Invalid email.',
    )
  }
}

const encrypt = (str, key = JWT_SECRET) => {
  if (!str) {
    return ''
  }
  if (str.length === 0 || str === '') {
    return ''
  }
  if (ENV === 'test') {
    key = 'RVh8MfVcCXM2bZdNUkuXymx5JENC4jxc'
  }

  const iv = crypto.randomBytes(16)
  const cipher = crypto.createCipheriv(
    'aes-256-cbc',
    Buffer.from(key),
    iv)

  let encrypted = cipher.update(str)
  encrypted = Buffer.concat([encrypted, cipher.final()])
  return iv.toString('hex') + ':' + encrypted.toString('hex')
}

const decrypt = (str, key = JWT_SECRET) => {
  if (!str) {
    return ''
  }
  if (str.length === 0 || str === '') {
    return ''
  }
  if (ENV === 'test') {
    key = 'RVh8MfVcCXM2bZdNUkuXymx5JENC4jxc'
  }

  const text = str.split(':')
  const iv = Buffer.from(text.shift(), 'hex')
  const encryptedText = Buffer.from(text.join(':'), 'hex')
  const decipher =
    crypto.createDecipheriv('aes-256-cbc', Buffer.from(key), iv)
  let decrypted = decipher.update(encryptedText)

  decrypted = Buffer.concat([decrypted, decipher.final()])
  return decrypted.toString()
}

module.exports = {
  parseString,
  encrypt,
  decrypt,
  parseEmail,
}
