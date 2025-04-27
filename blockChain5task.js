const SHA256 = require('crypto-js/sha256');
const MerkleTree = require('./merkleTree');
const MemPool = require('./memPool');

class Transaction {
    constructor(fromAddress, toAddress, amount, baseFee = 2, minerTip = 3) {
        this.fromAddress = fromAddress;
        this.toAddress = toAddress;
        this.amount = amount;
        this.baseFee = baseFee; // Base fee (gets burned)
        this.minerTip = minerTip; // Priority fee (goes to miner)
        this.timestamp = Date.now();
        this.signature = null; // Will be added when signed
    }

    calculateHash() {
        return SHA256(
            this.fromAddress + 
            this.toAddress + 
            this.amount +
            this.baseFee +
            this.minerTip +
            this.timestamp
        ).toString();
    }

    signTransaction(signingKey) {
        if (signingKey.getPublic('hex') !== this.fromAddress) {
            throw new Error('You cannot sign transactions for other wallets');
        }
        
        const hashTx = this.calculateHash();
        const sig = signingKey.sign(hashTx, 'base64');
        this.signature = sig.toDER('hex');
        
        // For SegWit, we store the signature separately
        this.witnessSignature = this.signature;
        // For the block itself, we remove the signature (SegWit implementation)
        this.signature = "WITNESS_REMOVED";
    }

    isValid() {
        if (this.fromAddress === null) return true; // Mining reward transaction
        
        if (!this.witnessSignature) {
            throw new Error('No signature in this transaction');
        }
        
        const publicKey = ec.keyFromPublic(this.fromAddress, 'hex');
        return publicKey.verify(this.calculateHash(), this.witnessSignature);
    }
}

class SegWitBlock {
    constructor(timestamp, transactions, previousHash = "") {
        this.timestamp = timestamp;
        this.transactions = this.removeWitnessData(transactions);
        this.witnessData = this.extractWitnessData(transactions);
        this.previousHash = previousHash;
        this.merkleRoot = this.calculateMerkleRoot();
        this.nonce = 0;
        this.hash = this.calculateHash();
    }

    // Extract witness data for SegWit
    extractWitnessData(transactions) {
        return transactions.map(tx => ({
            txHash: SHA256(JSON.stringify(tx)).toString(),
            signature: tx.witnessSignature
        }));
    }

    // Remove witness data from transactions for SegWit
    removeWitnessData(transactions) {
        return transactions.map(tx => {
            const txCopy = {...tx};
            // Replace actual signature with placeholder
            if (txCopy.witnessSignature) {
                txCopy.signature = "WITNESS_REMOVED";
            }
            delete txCopy.witnessSignature;
            return txCopy;
        });
    }

    calculateMerkleRoot() {
        if (this.transactions.length === 0) return "0";
        const merkleTree = new MerkleTree(this.transactions);
        return merkleTree.root;
    }

    calculateHash() {
        return SHA256(
            this.previousHash + 
            this.timestamp + 
            this.merkleRoot +
            this.nonce
        ).toString();
    }

    mineBlock(difficulty) {
        while (this.hash.substring(0, difficulty) !== Array(difficulty + 1).join('0')) {
            this.nonce++;
            this.hash = this.calculateHash();
        }
        console.log(`Block mined: ${this.hash}`);
    }

    hasValidTransactions() {
        // For this implementation, we assume all transactions are valid
        // In a real implementation, you would verify each transaction
        return true;
    }
}

class EnhancedBlockchain {
    constructor() {
        this.chain = [this.createGenesisBlock()];
        this.difficulty = 4;
        this.miningReward = 50;
        this.memPool = new MemPool();
        this.wallets = {}; // Track wallet balances
        this.burnedCoins = 0;
        this.minedCoins = 0;
    }

    createGenesisBlock() {
        return new SegWitBlock("01/01/2009", [], "0");
    }

    getLatestBlock() {
        return this.chain[this.chain.length - 1];
    }

    // Register a wallet with the blockchain
    registerWallet(address, initialBalance = 300) {
        if (!this.wallets[address]) {
            this.wallets[address] = initialBalance;
        }
    }

    // Add a new transaction to the mempool
    addTransaction(transaction) {
        // Validate transaction
        if (!transaction.fromAddress || !transaction.toAddress) {
            throw new Error("Transaction must include from and to addresses");
        }
        
        // Check sender has enough funds
        if (transaction.fromAddress !== null) { // Skip for mining rewards
            const senderBalance = this.getBalanceOfAddress(transaction.fromAddress);
            const totalCost = transaction.amount + transaction.baseFee + transaction.minerTip;
            
            if (senderBalance < totalCost) {
                throw new Error(`Insufficient balance. Required: ${totalCost}, Available: ${senderBalance}`);
            }
        }
        
        // Add to mempool
        this.memPool.addTransaction(transaction);
    }

    // Mine a new block with pending transactions
    minePendingTransactions(miningRewardAddress) {
        // Create mining reward transaction
        const rewardTx = new Transaction(
            null, 
            miningRewardAddress, 
            this.miningReward, 
            0, // No base fee for mining rewards
            0  // No miner tip for mining rewards
        );
        
        // Add mining reward to mempool
        this.memPool.addTransaction(rewardTx);
        
        // Get transactions for block (4 as per assignment)
        const blockTransactions = this.memPool.getBlockTransactions(4);
        
        // Create new block
        const block = new SegWitBlock(
            Date.now(), 
            blockTransactions, 
            this.getLatestBlock().hash
        );
        
        // Mine the block
        block.mineBlock(this.difficulty);
        
        // Add block to blockchain
        this.chain.push(block);
        
        // Process transactions (update balances, burn fees)
        this.processBlockTransactions(block);
        
        console.log('Block successfully mined');
        return block;
    }

    // Process transactions in a block
    processBlockTransactions(block) {
        for (const tx of block.transactions) {
            // Skip invalid transactions
            if (tx.fromAddress !== null) {
                // Deduct total amount from sender
                if (this.wallets[tx.fromAddress]) {
                    this.wallets[tx.fromAddress] -= (tx.amount + tx.baseFee + tx.minerTip);
                }
                
                // Add amount to recipient
                if (this.wallets[tx.toAddress]) {
                    this.wallets[tx.toAddress] += tx.amount;
                } else {
                    this.wallets[tx.toAddress] = tx.amount;
                }
                
                // Add miner tip to miner's balance
                if (tx.minerTip > 0) {
                    const miningTx = block.transactions.find(t => t.fromAddress === null);
                    const minerAddress = miningTx ? miningTx.toAddress : null;                    if (minerAddress && this.wallets[minerAddress]) {
                        this.wallets[minerAddress] += tx.minerTip;
                    }
                }
                
                // Burn the base fee
                this.burnedCoins += tx.baseFee;
            } else {
                // Mining reward transaction
                this.minedCoins += tx.amount;
                if (this.wallets[tx.toAddress]) {
                    this.wallets[tx.toAddress] += tx.amount;
                } else {
                    this.wallets[tx.toAddress] = tx.amount;
                }
            }
        }
    }

    // Get balance of an address
    getBalanceOfAddress(address) {
        return this.wallets[address] || 0;
    }

    // Get total coins in circulation
    getTotalCoins() {
        return Object.values(this.wallets).reduce((sum, balance) => sum + balance, 0);
    }

    // Get statistics about the blockchain
    getStats() {
        return {
            totalBlocks: this.chain.length,
            totalCoins: this.getTotalCoins(),
            minedCoins: this.minedCoins,
            burnedCoins: this.burnedCoins,
            activeWallets: Object.keys(this.wallets).length,
            walletBalances: {...this.wallets}
        };
    }

    // Validate the entire blockchain
    isChainValid() {
        for (let i = 1; i < this.chain.length; i++) {
            const currentBlock = this.chain[i];
            const previousBlock = this.chain[i - 1];
            
            // Validate block hash
            if (currentBlock.hash !== currentBlock.calculateHash()) {
                return false;
            }
            
            // Validate link to previous block
            if (currentBlock.previousHash !== previousBlock.hash) {
                return false;
            }
        }
        return true;
    }
}

module.exports = {
    Transaction,
    SegWitBlock,
    EnhancedBlockchain
};