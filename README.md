@voken/base32
=============

JavaScript component to compute voken flavored base 32 encoding.
This encoding is typically used for VOKEN (crypto-currency).


Install
-------


```
npm i --save @voken/base32
```

for yarn:

```
yarn add @voken/base32
```


API
---

### encode(input)

`input` must be a [Buffer](https://nodejs.org/api/buffer.html) or an `Array`. It returns a `string`.

**example**:

```js
const base32 = require('@voken/base32')

const bytes = Buffer.from('This is a example.')
const decoded = base32.encode(bytes)
console.log(decoded)
// => 58t39ecg6jvs0c4g6ax31dnr6rs9e
```


### decode(input)

`input` must be a base 58 encoded string. Returns a [Buffer](https://nodejs.org/api/buffer.html).

**example**:

```js
const base32 = require('@voken/base32')

const encoded = '58t39ecg6jvs0c4g6ax31dnr6rs9e'
const bytes = base32.decode(encoded)
console.log(bytes.toString())
// => This is a example.
```


Hack / Test
-----------

Uses JavaScript standard style. Read more:

[![js-standard-style](https://cdn.rawgit.com/feross/standard/master/badge.svg)](https://github.com/feross/standard)


Credits
-------
- [Mike Hearn](https://github.com/mikehearn) for original Java implementation
- [Stefan Thomas](https://github.com/justmoon) for porting to JavaScript
- [Stephan Pair](https://github.com/gasteve) for buffer improvements
- [Daniel Cousens](https://github.com/dcousens) for cleanup and merging improvements from bitcoinjs-lib
- [Jared Deckard](https://github.com/deckar01) for killing `bigi` as a dependency


License
-------

MIT
