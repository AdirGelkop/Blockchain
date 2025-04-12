const EC = require("elliptic").ec
const ec = new EC("secp256k1") //y^2 = x^3 + 7

const key = ec.genKeyPair()
const publicKey = key.getPublic('hex')
const privateKey = key.getPrivate('hex')

console.log()
console.log("Your public key === wallet Address, free shareable\n", publicKey)
console.log()
console.log("Your private key, keep it secret \n", privateKey)


