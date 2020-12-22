const base32 = require('../')

console.log(base32.encode(Buffer.from('This is a example.')))
console.log(base32.decode('58t39ecg6jvs0c4g6ax31dnr6rs9e').toString())
