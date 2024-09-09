const crypto = require('crypto');
const fs = require('fs');

// Generate key pair for encryption and decryption
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

// Encrypt data with the public key
function encryptWithPublicKey(publicKey, data) {
    const buffer = Buffer.from(data, 'utf8');
    return crypto.publicEncrypt(publicKey, buffer).toString('base64');
}

// Decrypt data with the private key
function decryptWithPrivateKey(privateKey, encryptedData) {
    const buffer = Buffer.from(encryptedData, 'base64');
    return crypto.privateDecrypt({
        key: privateKey,
        passphrase: 'your-passphrase' // Provide the passphrase here
    }, buffer).toString('utf8');
}

// Test encryption and decryption
const testData = 'This is a secret message!';
const encryptedData = encryptWithPublicKey(publicKey, testData);
console.log('Encrypted data:', encryptedData);

const decryptedData = decryptWithPrivateKey(privateKey, encryptedData);
console.log('Decrypted data:', decryptedData);
