const Buffer = require('safe-buffer').Buffer
const base32 = require('../')

const s = 'This is a sample'
console.log('String:', s)
console.log('>>>', base32.encode(Buffer.from(s)))

const h = '73696d706c792061206c6f6e6720737472696e67'
console.log('Hex:', h)
console.log('>>>', base32.encode(Buffer.from(h, 'hex')))
