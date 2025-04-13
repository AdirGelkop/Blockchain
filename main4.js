const{BlockChain, Block, Transaction} = require("./blockChain4.js")
const EC = require("elliptic").ec
const ec = new EC("secp256k1") //y^2 = x^3 + 7

const myKey = ec.keyFromPrivate('1bb4c4c20b51c0b44ad36ed123cf9a287e07d53b2a568b7ba3260dacd884eca6')
const myWalletAddress = myKey.getPublic('hex')

const gelkopNet = new BlockChain()

const tx1 = new Transaction(myWalletAddress, "address2", 100)
tx1.signTransaction(myKey)
gelkopNet.addTransaction(tx1)
gelkopNet.minePendingTransactions(myWalletAddress)

const tx2 = new Transaction(myWalletAddress, "address1", 50)
tx2.signTransaction(myKey)
gelkopNet.addTransaction(tx2)
gelkopNet.minePendingTransactions(myWalletAddress)

console.log('\nMy Balance : ', gelkopNet.getBalanceOfAddress(myWalletAddress))

//console.log(JSON.stringify(gelkopNet, null, 4))

