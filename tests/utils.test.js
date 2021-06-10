const { parseString, encrypt, decrypt, parseDate } = require('../src/utils')

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
  test('parseString dont pass +&%¤#"(', async () => {
    try {
      parseString('+&%¤#"(', 3, 16, true)
      expect(true).toBe(false)
    } catch (err) {
      const expErr =
      'Invalid +&%¤#"(, contains unicode charachters.'
      expect(err.message).toBe(expErr)
    }
  })

  test('encrypt returns encrypted text if text is not null', () => {
    const str = 'Tosisalaista'
    const text = encrypt(str)
    expect(text).not.toBe(str)
  })

  test('encrypt returns empty string if str is empty', () => {
    const str = ''
    const text = encrypt(str)
    expect(text).toBe(str)
  })

  test('encrypt returns empty string if str is undefined', () => {
    const str = undefined
    const text = encrypt(str)
    expect(text).toBe('')
  })


  test('decryption returns correct string', () => {
    const str = 'Tosisalaista'
    const text = encrypt(str)
    expect(decrypt(text)).toBe(str)
  })

  test('decryption returns empty string if str is empty', () => {
    const str = ''
    const text = encrypt(str)
    expect(decrypt(text)).toBe(str)
  })

  test('decryption returns empty string if str is undefined', () => {
    const str = undefined
    const text = encrypt(str)
    expect(decrypt(text)).toBe('')
  })

  test('Validate parseDate datelength !==3, length==2', async () => {
    try {
      parseDate('2000-12')
    } catch (err) {
      const expectedErr = 'Invalid date form.'
      expect(err.message).toBe(expectedErr)
    }
  })

  test('Validate parseDate datelength !==3, length==0', async () => {
    try {
      parseDate('')
      expect(true).toBe(true)
    } catch (err) {
      console.log(err)
      const expectedErr = 'Invalid date form.'
      expect(err.message).not.toBe(expectedErr)
    }
  })
  test('Validate parseDate datelength !==3, length==4', async () => {
    try {
      parseDate('2000-12-3-1')
    } catch (err) {
      const expectedErr = 'Invalid date form.'
      expect(err.message).toBe(expectedErr)
    }
  })
  test('Validate parseDate datelength !==3, length==9', async () => {
    try {
      parseDate('2000-12-3-1-3-4-77-11-33')
    } catch (err) {
      const expectedErr = 'Invalid date form.'
      expect(err.message).toBe(expectedErr)
    }
  })
})
