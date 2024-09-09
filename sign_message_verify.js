const crypto = require('crypto');
const fs = require('fs');
const path = require('path');


function signDataWithPrivateKey(privateKey, data) {
    const sign = crypto.createSign('SHA256');
    sign.update(data);
    sign.end();
    return sign.sign({
        key: privateKey,
        passphrase: 'your-passphrase' // Provide the passphrase here
    }, 'base64');
}

// Verify data with the public key
function verifySignatureWithPublicKey(publicKey, data, signature) {
    const verify = crypto.createVerify('SHA256');
    verify.update(data);
    verify.end();
    return verify.verify(publicKey, signature, 'base64');
}




const publicKeyPath = path.resolve(__dirname, 'publicKey.pem');
const privateKeyPath = path.resolve(__dirname, 'privateKey.pem');

// Load keys from files
function loadKeyFromFile(filePath, passphrase) {
    try {
        return fs.readFileSync(filePath, 'utf8');
    } catch (error) {
        console.error(`Error loading key from ${filePath}:`, error);
        throw error;
    }
}


const publicKey = loadKeyFromFile(publicKeyPath);
const privateKey = loadKeyFromFile(privateKeyPath, process.env.PRIVATE_KEY_PASSPHRASE);









// Test signing and verification
const testData = 'This is a secret message!';
const signature = signDataWithPrivateKey(privateKey, testData);
console.log('Signature:', signature);

const isVerified = verifySignatureWithPublicKey(publicKey, testData, signature);
console.log('Is the signature valid?', isVerified);
