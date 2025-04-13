const SHA256=require("crypto-js/sha256")
const EC = require("elliptic").ec
const ec = new EC("secp256k1") //y^2 = x^3 + 7


class Transaction {
    constructor(fromAddress, toAddress, amount) {
        this.fromAddress = fromAddress
        this.toAddress = toAddress
        this.amount = amount
        this.timestamp = Date.now()
    }
    calaulateHash() {
        return SHA256(this.fromAddress + this.toAddress + this.amount + this.timestamp).toString()
    }
    signTransaction(signinKey) {
        if(signinKey.getPublic('hex') !== this.fromAddress) {
            throw new Error('You cannot sign transaction from other wallet ! \n')
        }
        const hashTX = this.calaulateHash()
        const sig = signinKey.sign(hashTX, 'base64')
        this.signature = sig.toDER('hex')
    }
    isValid() {
        if(this.fromAddress === null)
            return true
        if(!this.signature || this.signature === 0) {
            throw new Error("There's no signature in this TX ! \n")
        }
        const publicKey = ec.keyFromPublic(this.fromAddress, 'hex')
        return publicKey.verify(this.calaulateHash(), this.signature)
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
    hasValidTransaction() {
        for(const tx of this.transactions) {
            if(!tx.isValid) {
                return false
            }
        }
        return true
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
        this.pendingTransactions = []
    }

/*     createTransaction(transaction) {
        this.pendingTransactions.push(transaction)
    }
 */

    addTransaction(transaction) {
        if(!transaction.fromAddress || !transaction.toAddress) {
            throw new Error("Transaction must include 'from' and 'to' addresses ! \n")
        }
        if(!transaction.isValid) {
            throw new Error("Cannot add an invalid transaction to the chain ! \n")
        }
        // if passed all validation tests, add tx to pending tx
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
            if(!currentBlock.hasValidTransaction()) {
                return false
            }
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
