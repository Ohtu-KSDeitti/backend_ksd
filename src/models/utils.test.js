const { parseString, encrypt, decrypt } = require('../utils')

describe('Testing parseString function (that checks regex of words)', () => {
  test('Unicode character does not pass', async () => {
    try {
      parseString('Ucode0360+', 3, 16, true)
      expect(true).toBe(false)
    } catch (err) {
      const expectedErr = 'Invalid Ucode0360+, contains unicode charachters.'
      expect(err.message).toBe(expectedErr)
    }
  })
  test('length is less than min', async () => {
    try {
      parseString('Pi', 3, 16, true)
      expect(true).toBe(false)
    } catch (err) {
      const expectedErr = 'Invalid Pi, minimum length 3, maximum length 16.'
      expect(err.message).toBe(expectedErr)
    }
  })
  test('length is more than max', async () => {
    try {
      parseString('PepsiMaxZeroSugar', 3, 16, true)
      expect(true).toBe(false)
    } catch (err) {
      const expErr =
      'Invalid PepsiMaxZeroSugar, minimum length 3, maximum length 16.'
      expect(err.message).toBe(expErr)
    }
  })

  test('Text is decrypted properly', () => {
    const str = 'Tosisalaista'
    const text = encrypt(str, 'RVh8MfVcCXM2bZdNUkuXymx5JENC4jxc')
    expect(text).not.toBe(str)
  })

  test('Text is decrypted and encrypted properly', () => {
    const str = 'Tosisalaista'
    const text = encrypt(str, 'RVh8MfVcCXM2bZdNUkuXymx5JENC4jxc')
    expect(decrypt(text, 'RVh8MfVcCXM2bZdNUkuXymx5JENC4jxc')).toBe(str)
  })
})
