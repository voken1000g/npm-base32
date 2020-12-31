const sha = require('@voken/sha')

const ALPHABET = '0123456789abcdefghjkmnpqrstuvwxy'

// encode
const encode = function (input, checksum = true) {
  const encoded = _encode(input)
  if (!checksum) {
    return encoded
  }

  const encodedArray = encoded.split('')

  const hash32 = sha.sha256(encoded)

  let output = ''
  encodedArray.forEach(function (c, i) {
    if (hash32[i % 32] > 127) {
      output = output + c.toUpperCase()
    } else {
      output = output + c
    }
  })

  return output
}

// decode
const decode = function (input, checksum = true) {
  const decoded = _decode(input)
  if (!checksum) {
    return decoded
  }

  const encodedChecksum = encode(decoded)

  if (input !== encodedChecksum) {
    throw new InvalidChecksumError('Invalid checksum')
  }

  return decoded
}

const isChecksum = function (input) {
  const decoded = _decode(input)
  const encodedChecksum = encode(decoded)

  return input === encodedChecksum
}

// encode without checksum
const _encode = function (input) {
  if (Array.isArray(input) || input instanceof Uint8Array) { input = Buffer.from(input) }
  if (!Buffer.isBuffer(input)) { throw new TypeError('Expected Buffer') }

  let bits = 0
  let value = 0
  let output = ''

  for (let i = 0; i < input.byteLength; i++) {
    value = (value << 8) | input[i]
    bits += 8

    while (bits >= 5) {
      output += ALPHABET[(value >>> (bits - 5)) & 31]
      bits -= 5
    }
  }

  if (bits > 0) {
    output += ALPHABET[(value << (5 - bits)) & 31]
  }

  // while ((output.length % 8) !== 0) {
  //   output += '='
  // }

  return output
}

// decode without checksum
const _decode = function (input) {
  input = input.replace(/=+$/, '').toLowerCase()

  const output = new Uint8Array((input.length * 5 / 8) | 0)

  let bits = 0
  let value = 0
  let index = 0
  for (let i = 0; i < input.length; i++) {
    value = (value << 5) | _readChar(input[i])
    bits += 5

    if (bits >= 8) {
      output[index++] = (value >>> (bits - 8)) & 255
      bits -= 8
    }
  }

  return Buffer.from(output)
}

// readChar
const _readChar = function (char) {
  const idx = ALPHABET.indexOf(char)

  if (idx === -1) {
    throw new InvalidCharacterError('Invalid character found: ' + char)
  }

  return idx
}

class InvalidCharacterError extends Error {
  constructor(message) {
    super(message);
    this.name = "InvalidCharacterError";
    this.code = 'INVALID_CHARACTER'
  }
}

class InvalidChecksumError extends Error {
  constructor(message) {
    super(message);
    this.name = "InvalidChecksumError";
    this.code = 'INVALID_CHECKSUM'
  }
}

module.exports = {
  encode: encode,
  decode: decode,
  isChecksum: isChecksum,

  InvalidCharacterError: InvalidCharacterError,
  InvalidChecksumError: InvalidChecksumError
}
