const { UserInputError } = require('apollo-server')
const crypto = require('crypto')

require('dotenv').config()

const JWT_SECRET = process.env.SECRET_KEY

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


const encrypt = (str) => {
  const iv = crypto.randomBytes(16)
  const cipher = crypto.createCipheriv(
    'aes-256-cbc',
    Buffer.from(JWT_SECRET),
    iv)

  let encrypted = cipher.update(str)
  encrypted = Buffer.concat([encrypted, cipher.final()])
  return iv.toString('hex') + ':' + encrypted.toString('hex')
}

const decrypt = (str) => {
  const text = str.split(':')
  const iv = Buffer.from(text.shift(), 'hex')
  const encryptedText = Buffer.from(text.join(':'), 'hex')
  const decipher =
    crypto.createDecipheriv('aes-256-cbc', Buffer.from(JWT_SECRET), iv)
  let decrypted = decipher.update(encryptedText)

  decrypted = Buffer.concat([decrypted, decipher.final()])
  return decrypted.toString()
}

module.exports = {
  parseString,
  encrypt,
  decrypt,
}
