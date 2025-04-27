const EC = require('elliptic').ec;
const ec = new EC('secp256k1');
const BloomFilter = require('./bloomFilter');
const MerkleTree = require('./merkleTree');
const LightWallet = require('./lightWallet');
const { Transaction, EnhancedBlockchain } = require('./blockChain5task');
const SHA256 = require('crypto-js/sha256');

console.log("=== Blockchain Demo with EIP-1559, Merkle Trees, and Bloom Filters ===");

// Generate 5 keypairs for testing
const wallets = [];
for (let i = 0; i < 5; i++) {
    const keyPair = ec.genKeyPair();
    wallets.push({
        privateKey: keyPair.getPrivate('hex'),
        publicKey: keyPair.getPublic('hex'),
        keyPair: keyPair
    });
    console.log(`Wallet ${i+1} created: ${keyPair.getPublic('hex').substring(0, 20)}...`);
}

// Create blockchain
const coin = new EnhancedBlockchain();

// Register wallets with initial balance
wallets.forEach(wallet => {
    coin.registerWallet(wallet.publicKey);
});

// Initialize mempool with some transactions
coin.memPool.generateInitialTransactions(wallets.map(w => w.publicKey));
coin.memPool.initialize();

console.log("\n=== Mining Blocks ===");
// Mine some blocks
for (let i = 0; i < 3; i++) {
    // Create some transactions
    for (let j = 0; j < 3; j++) {
        const sender = wallets[Math.floor(Math.random() * wallets.length)];
        const recipient = wallets[Math.floor(Math.random() * wallets.length)];
        
        if (sender.publicKey !== recipient.publicKey) {
            try {
                const tx = new Transaction(
                    sender.publicKey,
                    recipient.publicKey,
                    Math.floor(Math.random() * 10) + 5, // 5-15 coins
                    2, // Base fee (burned)
                    3  // Miner tip
                );
                tx.signTransaction(sender.keyPair);
                coin.addTransaction(tx);
                console.log(`Transaction created: ${sender.publicKey.substring(0, 10)}... -> ${recipient.publicKey.substring(0, 10)}...`);
            } catch (e) {
                console.log(`Transaction failed: ${e.message}`);
            }
        }
    }
    
    // Mine block
    console.log(`\nMining block ${i+1}...`);
    coin.minePendingTransactions(wallets[i % wallets.length].publicKey);
}

// Create a Merkle tree from the latest block
const latestBlock = coin.getLatestBlock();
const merkleTree = new MerkleTree(latestBlock.transactions);
console.log(`\nMerkle root of latest block: ${merkleTree.root}`);

// Create a light wallet
const lightWallet = new LightWallet(wallets[0].publicKey);
console.log(`\nLight wallet created for ${wallets[0].publicKey.substring(0, 20)}...`);

// Verify a transaction from the latest block using Merkle proof
if (latestBlock.transactions.length > 0) {
    const txToVerify = latestBlock.transactions[0];
    const proof = merkleTree.getProof(txToVerify);
    
    if (proof) {
        const isVerified = lightWallet.verifyTransaction(txToVerify, proof, merkleTree.root);
        console.log(`Transaction verification: ${isVerified ? 'SUCCESS' : 'FAILED'}`);
    } else {
        console.log('No proof available for transaction');
    }
}

// Create a Bloom filter for transactions
const filter = new BloomFilter(1024, 3);
console.log('\n=== Bloom Filter Demo ===');

// Add all transactions to the Bloom filter
coin.chain.forEach(block => {
    block.transactions.forEach(tx => {
        const txHash = SHA256(JSON.stringify(tx)).toString();
        filter.add(txHash);
        console.log(`Added transaction ${txHash.substring(0, 15)}... to Bloom filter`);
    });
});

// Check if a transaction is in the filter
const knownTx = coin.chain[1].transactions[0];
const knownTxHash = SHA256(JSON.stringify(knownTx)).toString();
console.log(`\nChecking known transaction: ${filter.contains(knownTxHash) ? 'FOUND' : 'NOT FOUND'}`);

// Check for a non-existent transaction
const fakeTxHash = SHA256(JSON.stringify({fake: 'transaction'})).toString();
console.log(`Checking fake transaction: ${filter.contains(fakeTxHash) ? 'FOUND (false positive)' : 'NOT FOUND'}`);

// Print final statistics
console.log('\n=== Blockchain Statistics ===');
const stats = coin.getStats();
console.log(`Total blocks: ${stats.totalBlocks}`);
console.log(`Total coins in circulation: ${stats.totalCoins}`);
console.log(`Total mined coins: ${stats.minedCoins}`);
console.log(`Total burned coins: ${stats.burnedCoins}`);
console.log('\n=== Wallet Balances ===');
Object.entries(stats.walletBalances).forEach(([address, balance]) => {
    console.log(`${address.substring(0, 15)}...: ${balance} coins`);
});