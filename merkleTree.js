const SHA256 = require('crypto-js/sha256');

class MerkleTree {
    constructor(leaves) {
        // Convert transactions to string hashes if they aren't already
        this.leaves = leaves.map(leaf => 
            typeof leaf === 'string' ? leaf : SHA256(JSON.stringify(leaf)).toString());
        this.root = this.buildTree(this.leaves);
    }

    // Build the Merkle tree and return the root
    buildTree(leaves) {
        if (leaves.length === 0) return '';
        if (leaves.length === 1) return leaves[0];

        const parents = [];
        
        // Process pairs of leaves
        for (let i = 0; i < leaves.length; i += 2) {
            const leftChild = leaves[i];
            // If odd number of leaves, duplicate the last one
            const rightChild = i + 1 < leaves.length ? leaves[i + 1] : leftChild;
            
            // Create parent by hashing the children
            const parent = SHA256(leftChild + rightChild).toString();
            parents.push(parent);
        }
        
        // Recursively build the tree
        return this.buildTree(parents);
    }

    // Get proof of inclusion for a leaf
    getProof(leaf) {
        const leafHash = typeof leaf === 'string' ? 
            leaf : SHA256(JSON.stringify(leaf)).toString();
        
        const proof = [];
        let currentLevel = this.leaves;
        let targetIndex = currentLevel.findIndex(l => l === leafHash);
        
        if (targetIndex === -1) return null; // Leaf not found
        
        while (currentLevel.length > 1) {
            const nextLevel = [];
            const sibling = targetIndex % 2 === 0 ?
                (targetIndex + 1 < currentLevel.length ? currentLevel[targetIndex + 1] : currentLevel[targetIndex]) :
                currentLevel[targetIndex - 1];
            
            proof.push({
                position: targetIndex % 2 === 0 ? 'right' : 'left',
                data: sibling
            });
            
            // Process pairs to create next level
            for (let i = 0; i < currentLevel.length; i += 2) {
                const left = currentLevel[i];
                const right = i + 1 < currentLevel.length ? currentLevel[i + 1] : left;
                nextLevel.push(SHA256(left + right).toString());
            }
            
            // Update target index for next level
            targetIndex = Math.floor(targetIndex / 2);
            currentLevel = nextLevel;
        }
        
        return proof;
    }

    // Verify a proof
    static verify(leaf, proof, root) {
        let hashValue = typeof leaf === 'string' ? 
            leaf : SHA256(JSON.stringify(leaf)).toString();
        
        for (const step of proof) {
            if (step.position === 'left') {
                hashValue = SHA256(step.data + hashValue).toString();
            } else {
                hashValue = SHA256(hashValue + step.data).toString();
            }
        }
        
        return hashValue === root;
    }
}

module.exports = MerkleTree;