const crypto = require('crypto');

class BloomFilter {
    constructor(size = 1024, hashFunctions = 3) {
        this.size = size;
        this.hashFunctions = hashFunctions;
        this.bitArray = new Array(size).fill(0);
    }

    // Add an element to the filter
    add(element) {
        const hashes = this._getHashes(element);
        hashes.forEach(hash => {
            this.bitArray[hash] = 1;
        });
    }

    // Test if element might be in the set
    contains(element) {
        const hashes = this._getHashes(element);
        return hashes.every(hash => this.bitArray[hash] === 1);
    }

    // Generate hash values for an element
    _getHashes(element) {
        const hashes = [];
        let data = String(element);
        
        for (let i = 0; i < this.hashFunctions; i++) {
            const hash = crypto.createHash('sha256')
                .update(data + i)
                .digest('hex');
            
            // Convert hash to a number within range of filter size
            const index = parseInt(hash.substring(0, 8), 16) % this.size;
            hashes.push(index);
        }
        
        return hashes;
    }
}

module.exports = BloomFilter;