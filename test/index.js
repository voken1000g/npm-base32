const test = require('tape')
const base32 = require('../')

const fixtures = require('./fixtures.json')

test('base32', function (t) {
  t.test('encode', function (t) {
    fixtures.valid.forEach(function (f) {
      t.test('can encode ' + f.input, function (t) {
        const actual = base32.encode(Buffer.from(f.input, f.encoding))
        t.equal(actual, f.output)
        t.end()
      })
    })

    t.end()
  })

  t.test('decode', function (t) {
    fixtures.valid.forEach(function (f) {
      t.test('can decode ' + f.output, function (t) {
        const actual = base32.decode(f.output).toString(f.encoding)
        t.same(actual, f.input)
        t.end()
      })
    })

    fixtures.invalidCharacter.forEach(function (f) {
      t.test('throws on ' + f.description, function (t) {
        t.throws(function () {
          base32.decode(f.input)
        }, base32.InvalidCharacterError)
        t.end()
      })
    })

    fixtures.invalidChecksum.forEach(function (f) {
      t.test('throws on ' + f.description, function (t) {
        t.throws(function () {
          base32.decode(f.input)
        }, base32.InvalidChecksum)
        t.end()
      })
    })

    t.end()
  })

  t.end()
})
