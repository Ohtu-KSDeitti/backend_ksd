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
        'Invalid input, contains unicode charachters.',
      )
    }
  }

  if (length < min || length > max) {
    throw new UserInputError(
      `Invalid input, minimum length ${min}, maximum length ${max}.`,
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

const parseBio = (bio) => {
  if (!bio) {
    return
  }

  if (bio.length > 500) {
    throw new UserInputError(
      'Bio accepts only letters and spaces, max length 500',
    )
  }
  if (/^([A-Z|a-z]+\s)*$/.test(bio)) {
    throw new UserInputError(
      'Bio accepts only letters and spaces, max length 500',
    )
  }
}

const parseDate = (date) => {
  if (!date || date.length === 0) {
    return
  }

  const oldDate = date.split('-')

  if (oldDate.length !== 3) {
    throw new UserInputError(
      'Invalid date form.',
    )
  }
  // frontend yyyy-mm-dd --> mm-dd-yyyy
  const newDate = [oldDate[1], oldDate[2], oldDate[0]]
  const isValid = !isNaN(Date.parse(newDate.join('-')))

  if (!isValid) {
    throw new UserInputError(
      'Invalid date form.',
    )
  }
}

const parseLocation = (location) => {
  if (!location) {
    return
  }

  if (!/[a-zA-Z]*/.test(location)) {
    throw new UserInputError(
      'Location should only contain letters.',
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
  parseDate,
  parseBio,
  parseLocation,
}
