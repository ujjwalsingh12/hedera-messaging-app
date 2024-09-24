const { PrivateKey } = require('@hashgraph/sdk');

// Generate a new private key
const operatorPrivateKey = PrivateKey.generate();

// Log the private key in base58 format
console.log(`Private Key: ${operatorPrivateKey}`);
console.log(`Public Key: ${operatorPrivateKey.publicKey.toString()}`);
