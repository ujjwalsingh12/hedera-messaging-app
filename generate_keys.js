const crypto = require('crypto');

// Generate key pair for encryption and decryption
function generateKeyPair() {
    const { publicKey, privateKey } = crypto.generateKeyPairSync('rsa', {
        modulusLength: 1024,  // Size of the key in bits
        publicKeyEncoding: {
            type: 'spki',     // Subject Public Key Info
            format: 'pem'     // Export format
        },
        privateKeyEncoding: {
            type: 'pkcs8',    // Private Key Info (PKCS#8)
            format: 'pem',    // Export format
            cipher: 'aes-256-cbc', // Optional: Encrypt private key with a cipher
            passphrase: 'your-passphrase' // Optional: Provide a passphrase
        }
    });

    return { publicKey, privateKey };
}

// Generate keys for both sender and recipient
const { publicKey, privateKey } = generateKeyPair();

// Output keys
console.log('Private Key (PEM):', privateKey);
console.log('Public Key (PEM):', publicKey);
