# Blockchain

# Simple Blockchain Implementation

A lightweight JavaScript implementation of a blockchain that demonstrates the core concepts of blockchain technology including blocks, hashing, and chain structure.

## Project Structure

```
Blockchain/
├── blockChain.js    # Core blockchain implementation
├── main.js          # Example usage
├── package.json     # Project metadata and dependencies
└── README.md        # This file
```

## Implementation

This project implements two main classes:

### Block
Each block contains:
- `index`: Position in the blockchain
- `timestamp`: When the block was created
- `data`: Information stored in the block
- `previousHash`: Hash of the preceding block
- `hash`: SHA-256 hash of the block's content

### BlockChain
Manages the sequence of blocks with functionality to:
- Initialize with a genesis block
- Add new blocks to the chain
- Get the latest block in the chain

## Technical Details

- Uses Node.js as the runtime environment
- Employs the crypto-js library for SHA-256 hashing
- Each block's hash is generated from its index, timestamp, data, and the previous block's hash
- The chain integrity is maintained by including the previous block's hash in each new block

## Getting Started

### Prerequisites
- Node.js
- npm

### Installation

```bash
# Install dependencies
npm install
```

### Running the Example

```bash
# Execute the main script
node main.js
```

This creates a blockchain with a genesis block and adds two transaction blocks to it, then displays the entire blockchain in JSON format.

## Example Output

The example in main.js creates a blockchain called "gelkopNet" with:
- A genesis block (created automatically)
- Block 1: Timestamp "17/3/2025" with transaction amount of 4
- Block 2: Timestamp "18/3/2025" with transaction amount of 8

When run, it outputs the entire blockchain structure in a formatted JSON string.