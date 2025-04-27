# 🔗 Simple Blockchain Implementation

A JavaScript implementation of blockchain technology demonstrating core concepts through progressive iterations - from basic blockchain structure to transaction processing with cryptographic security.

## 🧩 Core Classes

### Block
The fundamental unit of the blockchain that stores data and maintains chain integrity.
- Stores transactions or data with timestamp
- Contains cryptographic link to previous block
- Implements hashing and mining capabilities

### BlockChain
Manages the entire chain of blocks and implements consensus rules.
- Maintains an ordered chain of blocks
- Handles block addition and validation
- Manages mining difficulty
- Verifies chain integrity

### Transaction
Represents value transfers between addresses (in later implementations).
- Tracks sender and recipient addresses
- Records transfer amount
- Contains timestamp for additional security

## 📁 Project Structure

```
Blockchain/
├── blockChain.js      # Basic blockchain implementation
├── blockChain1.js     # Added chain validation
├── blockChain2.js     # Added proof of work mining
├── blockChain3.js     # Added transaction system
├── blockChain4.js     # Enhanced transaction system
├── blockChain5task.js # EIP-1559 implementation with advanced features
├── bloomFilter.js     # Bloom filter implementation
├── merkleTree.js      # Merkle tree implementation
├── memPool.js         # Memory pool for pending transactions
├── lightWallet.js     # Light wallet implementation
├── Keygenerator.js    # Elliptic curve key pair generation
├── main.js            # Example usage for basic blockchain
├── main1.js           # Example with chain validation
├── main2.js           # Example with mining
├── main3.js           # Example with transactions
├── main4.js           # Example with enhanced transactions
├── main5task.js       # Demo of EIP-1559, Merkle Trees, and Bloom Filters
├── initialTransactions.json # Initial mempool transactions
├── package.json       # Project metadata and dependencies
└── README.md          # This file
```

## 💡 Implementation Concepts

This project demonstrates a series of blockchain concepts through progressive implementations, each building upon the previous:

### 1. Basic Blockchain (blockChain.js) 📦
- **Block Structure**: Each block contains:
  - `index`: Position in the blockchain
  - `timestamp`: Creation time
  - `data`: Information stored in the block
  - `previousHash`: Hash of the preceding block
  - `hash`: SHA-256 hash of the block's content
- **Genesis Block**: The first block in the chain with hardcoded values
- **Block Linking**: Each block references the previous block's hash

### 2. Chain Validation (blockChain1.js) ✅
- **Chain Integrity**: Added validation to ensure blocks cannot be tampered with
- **Validation Logic**: Checks if:
  - Each block's calculated hash matches its stored hash
  - Each block correctly references the previous block's hash

### 3. Proof of Work Mining (blockChain2.js) ⛏️
- **Mining Difficulty**: Configurable difficulty level (number of leading zeros required in hash)
- **Mining Process**:
  - Increments nonce until a hash with required leading zeros is found
  - Simulates computational work required to add blocks
- **Consensus Mechanism**: A basic implementation of proof-of-work

### 4. Transaction System (blockChain3.js) 💸
- **Transactions**: Represents transfers between addresses
- **Pending Transactions**: Transactions wait in a pool until mined
- **Mining Rewards**: Miners are rewarded with new coins
- **Balance Tracking**: Calculate balance for any address

### 5. Enhanced Transactions (blockChain4.js) 🔄
- **Transaction Timestamps**: Added to improve security
- **Refined Hashing**: Improved hash calculation for blocks

### 6. Cryptographic Key Generation (Keygenerator.js) 🔑
- **Elliptic Curve Cryptography**: Uses secp256k1 curve (same as Bitcoin)
- **Key Pairs**: Generates public/private key pairs
- **Wallet Identity**: Public key serves as wallet address

### 7. EIP-1559 Implementation (blockChain5task.js) 💎
- **Bloom Filter**: Efficient transaction lookups
- **Merkle Tree**: Transaction verification for light clients
- **Light Wallets**: Simplified verification without full blockchain
- **Fee Structure**:
  - Base fee (2 coins) that gets burned
  - Miner priority tip (3 coins) for transaction inclusion
- **SegWit**: Separation of witness data from transaction data
- **Memory Pool**: Manages 30 pending transactions in JSON format
- **Enhanced Statistics**: Tracking of mined and burned coins

## 🛠️ Technical Details

- **Hashing**: SHA-256 via crypto-js library
- **Cryptography**: Elliptic curve (secp256k1) via elliptic library
- **Data Structure**: Linked blocks form an immutable chain
- **Mining**: Adjustable difficulty proof-of-work system
- **Transaction Processing**: UTXO-inspired balance tracking
- **Validation**: Multi-level integrity verification
- **Merkle Trees**: Efficient transaction verification
- **Bloom Filters**: Probabilistic data structure for fast lookups
- **EIP-1559**: Implementation of Ethereum's fee market change

## 🚀 Getting Started

### Prerequisites
- Node.js
- npm

### Installation

```bash
# Install dependencies
npm install
```

### Running the Examples

```bash
# Basic blockchain
node main.js

# Chain validation
node main1.js

# Proof of work mining
node main2.js

# Transactions and mining rewards
node main3.js

# Enhanced transactions
node main4.js

# EIP-1559, Merkle Trees and Bloom Filters
node main5task.js

# Generate key pair
node Keygenerator.js
```

## 🔐 Security Concepts Demonstrated

- **Immutability**: Changes to a block invalidate the entire chain
- **Proof of Work**: Mining requires computational effort, making attacks costly
- **Cryptographic Identity**: Public/private key pairs for secure transactions
- **Chain Validation**: Continuous integrity checks maintain security
- **Merkle Proofs**: Efficient validation without full blockchain
- **SegWit**: Separation of signature data from transaction data

## 🔮 Future Improvements

Potential enhancements could include:
- P2P networking for decentralized operation
- Smart contract functionality
- More advanced consensus mechanisms
- Web interface for blockchain exploration
- Memory-optimized block storage
- Advanced light client protocols

## 📊 Visual Architecture

```
┌─────────────────────────────────────────┐
│                                         │
│               BlockChain                │
│                                         │
│  ┌─────────┐   ┌─────────┐   ┌────────┐ │
│  │         │   │         │   │        │ │
│  │ Block 0 ├───► Block 1 ├───► Block n│ │
│  │         │   │         │   │        │ │
│  └─────────┘   └─────────┘   └────────┘ │
│                                         │
│  ┌─────────────────────────────────┐    │
│  │       Pending Transactions      │    │
│  │                                 │    │
│  │  ┌─────────┐  ┌─────────────┐   │    │
│  │  │  Tx 1   │  │    Tx 2     │   │    │
│  │  └─────────┘  └─────────────┘   │    │
│  └─────────────────────────────────┘    │
│                                         │
└─────────────────────────────────────────┘
```