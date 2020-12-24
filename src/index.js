const crypto = require('crypto')
const Buffer = require('safe-buffer').Buffer

const base32 = function () {
  const ALPHABET = '0123456789abcdefghjkmnpqrstuvwxy'

  // encode
  const encode = function (input) {
    const encoded = encodeWithoutChecksum(input)
    const encodedArray = encoded.split('')

    const hash32 = _sha256(encoded)

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
  const decode = function (input) {
    const decoded = decodeWithoutChecksum(input)
    const encodedChecksum = encode(decoded)

    if (input !== encodedChecksum) {
      throw new InvalidChecksum('Invalid checksum with: ' + encodedChecksum)
    }

    return decoded
  }

  const isChecksum = function (input) {
    const decoded = decodeWithoutChecksum(input)
    const encodedChecksum = encode(decoded)

    return input === encodedChecksum
  }

  // encode without checksum
  const encodeWithoutChecksum = function (input) {
    if (Array.isArray(input) || input instanceof Uint8Array) {
      input = Buffer.from(input)
    }

    if (!Buffer.isBuffer(input)) {
      throw new TypeError('Expect `input` is type of Buffer | Uint8Array | Array, but got ' + typeof input)
    }

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
  const decodeWithoutChecksum = function (input) {
    input = input.replace(/=+$/, '').toLowerCase()

    let output = new Uint8Array((input.length * 5 / 8) | 0)

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
    let idx = ALPHABET.indexOf(char)

    if (idx === -1) {
      throw new InvalidCharacterError('Invalid character found: ' + char)
    }

    return idx
  }

  // sha256
  const _sha256 = function (value) {
    return crypto.createHash('sha256').update(value).digest()
  }

  // InvalidCharacterError
  const InvalidCharacterError = function (message) {
    this.message = message
  }
  InvalidCharacterError.prototype = new Error()
  InvalidCharacterError.prototype.name = 'InvalidCharacterError'

  // InvalidChecksum
  const InvalidChecksum = function (message) {
    this.message = message
  }
  InvalidChecksum.prototype = new Error()
  InvalidChecksum.prototype.name = 'InvalidChecksum'

  //
  return {
    encode: encode,
    decode: decode,
    isChecksum: isChecksum,
    encodeWithoutChecksum: encodeWithoutChecksum,
    decodeWithoutChecksum: decodeWithoutChecksum,

    InvalidCharacterError: InvalidCharacterError,
    InvalidChecksum: InvalidChecksum
  }
}

module.exports = base32()
