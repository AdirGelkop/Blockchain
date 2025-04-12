const{BlockChain, Block, Transaction} = require("./blockChain3.js")

let gelkopNet = new BlockChain()

gelkopNet.createTransaction(new Transaction('address1', "Bob's Wallet", 100))
gelkopNet.createTransaction(new Transaction("Bob's Wallet", 'address2', 50))

console.log('\nMining Block...... ')

gelkopNet.minePendingTransactions("Bob's Wallet")

console.log('\nBalance of Bob : ', gelkopNet.getBalanceOfAddress("Bob's Wallet"))

//console.log(JSON.stringify(gelkopNet, null, 4))

