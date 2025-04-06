const{BlockChain, Block} = require("./blockChain")

let gelkopNet = new BlockChain()
gelkopNet.addBlock(new Block(1, "17/3/2025", {amount: 4}))
gelkopNet.addBlock(new Block(1, "18/3/2025", {amount: 8}))

console.log(JSON.stringify(gelkopNet, null, 4))

