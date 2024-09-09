const crypto = require('crypto');
const fs = require('fs');

// Generate key pair for signing and verification
function generateKeyPair() {
    const { publicKey, privateKey } = crypto.generateKeyPairSync('rsa', {
        modulusLength: 2048,  // Size of the key in bits
        publicKeyEncoding: {
            type: 'spki',     // Subject Public Key Info
            format: 'pem'     // Export format
        },
        privateKeyEncoding: {
            type: 'pkcs8',    // Private Key Info (PKCS#8)
            format: 'pem',    // Export format
            cipher: 'aes-256-cbc', // Encrypt private key with a cipher
            passphrase: 'your-passphrase' // Provide a passphrase
        }
    });

    return { publicKey, privateKey };
}

// Generate keys
const { publicKey, privateKey } = generateKeyPair();

// Define file paths
const publicKeyPath = './publicKey.pem';
const privateKeyPath = './privateKey.pem';

// Write keys to files
fs.writeFileSync(publicKeyPath, publicKey);
fs.writeFileSync(privateKeyPath, privateKey);

console.log(`Public key saved to ${publicKeyPath}`);
console.log(`Private key saved to ${privateKeyPath}`);

