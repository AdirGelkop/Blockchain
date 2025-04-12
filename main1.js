const{BlockChain, Block} = require("./blockChain1.js")

let gelkopNet = new BlockChain()
gelkopNet.addBlock(new Block(1, "17/3/2025", {amount: 4}))
gelkopNet.addBlock(new Block(2, "18/3/2025", {amount: 8}))

console.log('blockChain Valid ? ' + gelkopNet.isChainValid())

console.log( 'changing the block')

gelkopNet.chain[1].data = {amount:100}

console.log('blockChain Valid ? ' + gelkopNet.isChainValid())


//console.log(JSON.stringify(gelkopNet, null, 4))

