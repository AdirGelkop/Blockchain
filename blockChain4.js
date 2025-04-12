const SHA256=require("crypto-js/sha256")

class Transaction {
    constructor(fromAddress, toAddress, amount) {
        this.fromAddress = fromAddress
        this.toAddress = toAddress
        this.amount = amount
        this.timestamp = Date.now()
    }

}

class Block {
    constructor(timestamp, transactions, previousHash=" ") {
        this.timestamp = timestamp
        this.transactions = transactions
        this.previousHash = previousHash
        this.hash = this.calaulateHash()
        this.nonce = 0
    }

    calaulateHash() {
        return SHA256(this.previousHash + this.timestamp + JSON.stringify(this.transactions)+this.nonce+this.timestamp).toString()
    }

    mineBlock(difficulty) {
        while(this.hash.substring(0, difficulty) !== Array(difficulty + 1).join('0')) {
            this.nonce++
            this.hash = this.calaulateHash()
        }
        console.log('Block Mined : ' + this.hash + ' nonce number : ' + this.nonce)
    }
}

class BlockChain {
    constructor() {
        this.chain = [this.createGenesisBlock()]
        this.difficulty = 5
        this.pendingTransactions = []
        this.miningReward = 200
    }

    createGenesisBlock() {
        return new Block("01/01/2009", "Genesis Block", "0")
    }

    getLatestBlock() {
        return this.chain[this.chain.length-1]
    }

/*     addBlock(newBlock) {
        newBlock.previousHash = this.getLatestBlock().hash
        newBlock.mineBlock(this.difficulty)
        this.chain.push(newBlock)
    } */

    minePendingTransactions(miningRewardAddress) {
        const rewardTransaction = new Transaction(null, miningRewardAddress, this.miningReward)
        this.pendingTransactions.push(rewardTransaction)

        let block = new Block(Date.now(), this.pendingTransactions, this.getLatestBlock().hash)
        block.mineBlock(this.difficulty)
        console.log('Block successfully mined ')
        this.chain.push(block)
        this.minePendingTransactions = []
    }

    createTransaction(transaction) {
        this.pendingTransactions.push(transaction)
    }

    getBalanceOfAddress(address) {
        //Just for clarity
        let balance = 0
        for(const block of this.chain) {
            for(const trans of block.transactions) {
                if(trans.fromAddress === address) {
                    balance -= trans.amount
                }
                if(trans.toAddress === address) {
                    balance += trans.amount
                }
            }
        }
        return balance
    }

    isChainValid() {
        for (let i = 1; i < this.chain.length; i++) {
            const currentBlock = this.chain[i]
            const previousBlock = this.chain[i-1]

            if(currentBlock.hash !== currentBlock.calaulateHash()) {
                return false
            }
            if(currentBlock.previousHash !== previousBlock.hash) {
                return false
            }
        }
        return true
    }
}

module.exports.BlockChain = BlockChain
module.exports.Block = Block
module.exports.Transaction = Transaction
