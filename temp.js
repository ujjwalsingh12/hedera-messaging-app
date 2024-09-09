const { Client, TopicMessageSubmitTransaction } = require("@hashgraph/sdk");

require("dotenv").config();

const client = Client.forTestnet();
client.setOperator(process.env.HEDERA_ACCOUNT_ID, process.env.HEDERA_PRIVATE_KEY);

async function sendEncryptedMessage(topicId, encryptedMessage) {
    const transaction = new TopicMessageSubmitTransaction({
        topicId: topicId,
        message: encryptedMessage.toString('base64')  // Convert the encrypted message to base64 format
    });

    const response = await transaction.execute(client);
    const receipt = await response.getReceipt(client);

    console.log(`Encrypted message sent to topic: ${topicId}`);
}



const crypto = require('crypto');
const fs = require('fs');
const path = require('path');



// Load keys from files
function loadKeyFromFile(filePath, passphrase) {
    try {
        return fs.readFileSync(filePath, 'utf8');
    } catch (error) {
        console.error(`Error loading key from ${filePath}:`, error);
        throw error;
    }
}


function signDataWithPrivateKey(privateKey, data) {
    const sign = crypto.createSign('SHA256');
    sign.update(data);
    sign.end();
    return sign.sign({
        key: privateKey,
        passphrase: 'your-passphrase' // Provide the passphrase here
    }, 'base64');
}

const publicKeyPath = path.resolve(__dirname, 'publicKey.pem');
const privateKeyPath = path.resolve(__dirname, 'privateKey.pem');
const publicKey = loadKeyFromFile(publicKeyPath);
const privateKey = loadKeyFromFile(privateKeyPath, process.env.PRIVATE_KEY_PASSPHRASE);

// Test signing and verification
const testData = 'This is a secret message!';
const signature = signDataWithPrivateKey(privateKey, testData);
console.log('Signature:', signature);




// // Function to encrypt the message
// // Example: Encrypt the message using the recipient's public key
// function encryptMessage(publicKey, message) {
//     return crypto.publicEncrypt(publicKey, Buffer.from(message));
// }
// const encryptedMessage = encryptMessage(recipientPublicKey, "Hello, this is a secret message!");




// Replace with your topicId and encrypted message
sendEncryptedMessage("0.0.4842073", testData);
sendEncryptedMessage("0.0.4842073", signature);