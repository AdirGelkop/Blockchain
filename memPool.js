const fs = require('fs');
const path = require('path');

class MemPool {
    constructor() {
        this.transactions = [];
        this.initialized = false;
    }

    // Load initial transactions from JSON file
    initialize(filename = 'initialTransactions.json') {
        if (this.initialized) return;
        
        try {
            const rawData = fs.readFileSync(path.join(__dirname, filename));
            this.transactions = JSON.parse(rawData);
            this.initialized = true;
            console.log(`Loaded ${this.transactions.length} transactions into mempool`);
        } catch (error) {
            console.error('Failed to load initial transactions:', error.message);
            this.transactions = [];
            this.initialized = true;
        }
    }

    // Add a new transaction to the pool
    addTransaction(transaction) {
        // Special case for mining rewards which have null fromAddress
        if (transaction.fromAddress === null) {
            this.transactions.push(transaction);
            return this.transactions.length - 1;
        }
        
        // Regular transaction validation
        if (!transaction.fromAddress || !transaction.toAddress || 
            transaction.amount <= 0 || !transaction.baseFee || !transaction.minerTip) {
            throw new Error('Invalid transaction');
        }
        
        this.transactions.push(transaction);
        return this.transactions.length - 1; // Return index of added transaction
    }

    // Get transactions for a new block (default 4 as per assignment)
    getBlockTransactions(count = 4) {
        // Sort by miner tip (highest first) to maximize miner revenue
        const sortedTransactions = [...this.transactions]
            .sort((a, b) => b.minerTip - a.minerTip);
        
        // Get top transactions
        const selectedTransactions = sortedTransactions.slice(0, count);
        
        // Remove selected transactions from the pool
        this.transactions = this.transactions.filter(
            tx => !selectedTransactions.some(
                selected => JSON.stringify(selected) === JSON.stringify(tx)
            )
        );
        
        return selectedTransactions;
    }

    // Get current size of mempool
    size() {
        return this.transactions.length;
    }

    // Generate initial transaction file if it doesn't exist
    generateInitialTransactions(walletAddresses) {
        const transactions = [];
        
        // Generate 30 random transactions between wallets
        for (let i = 0; i < 30; i++) {
            const fromIndex = Math.floor(Math.random() * walletAddresses.length);
            let toIndex;
            do {
                toIndex = Math.floor(Math.random() * walletAddresses.length);
            } while (toIndex === fromIndex);
            
            const amount = Math.floor(Math.random() * 20) + 5; // Random amount between 5-25
            
            transactions.push({
                fromAddress: walletAddresses[fromIndex],
                toAddress: walletAddresses[toIndex],
                amount: amount,
                baseFee: 2, // As per assignment
                minerTip: 3, // As per assignment
                timestamp: Date.now() + i * 1000 // Spaced out slightly
            });
        }
        
        fs.writeFileSync(
            path.join(__dirname, 'initialTransactions.json'),
            JSON.stringify(transactions, null, 2)
        );
        
        console.log('Generated 30 initial transactions');
        return transactions;
    }
}

module.exports = MemPool;