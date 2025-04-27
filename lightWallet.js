const SHA256 = require('crypto-js/sha256');
const EC = require('elliptic').ec;
const ec = new EC('secp256k1');

class LightWallet {
    constructor(address) {
        this.address = address;
        this.balance = 300; // Initial balance as per assignment
        this.transactionProofs = {}; // Store transaction proofs
    }

    // Verify a transaction is in the Merkle tree
    verifyTransaction(transaction, proof, merkleRoot) {
        const txHash = SHA256(JSON.stringify(transaction)).toString();
        
        // Start with the transaction hash
        let currentHash = txHash;
        
        // Apply each proof element
        for (const proofElement of proof) {
            if (proofElement.position === 'left') {
                // If proof element is on the left, concatenate: [proof element] + [current hash]
                currentHash = SHA256(proofElement.data + currentHash).toString();
            } else {
                // If proof element is on the right, concatenate: [current hash] + [proof element]
                currentHash = SHA256(currentHash + proofElement.data).toString();
            }
        }
        
        // The final hash should match the merkle root
        return currentHash === merkleRoot;
    }

    // Check if we can afford a transaction
    canSendTransaction(amount, baseFee, minerTip) {
        const totalCost = amount + baseFee + minerTip;
        return this.balance >= totalCost;
    }

    // Send transaction (returns transaction object but doesn't modify balance)
    createTransaction(toAddress, amount, baseFee = 2, minerTip = 3) {
        if (!this.canSendTransaction(amount, baseFee, minerTip)) {
            throw new Error('Insufficient funds');
        }

        return {
            fromAddress: this.address,
            toAddress: toAddress,
            amount: amount,
            baseFee: baseFee,
            minerTip: minerTip,
            timestamp: Date.now()
        };
    }

    // Update balance after transaction is confirmed
    processConfirmedTransaction(transaction) {
        if (transaction.fromAddress === this.address) {
            this.balance -= (transaction.amount + transaction.baseFee + transaction.minerTip);
        } else if (transaction.toAddress === this.address) {
            this.balance += transaction.amount;
        }
    }
}

module.exports = LightWallet;