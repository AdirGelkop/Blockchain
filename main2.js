const{BlockChain, Block} = require("./blockChain2.js")

let gelkopNet = new BlockChain()
console.log('Mining Block...... ')
gelkopNet.addBlock(new Block(1, "17/3/2025", {amount: 4}))
console.log('Mining Block...... ')
gelkopNet.addBlock(new Block(2, "18/3/2025", {amount: 8}))



//console.log(JSON.stringify(gelkopNet, null, 4))

