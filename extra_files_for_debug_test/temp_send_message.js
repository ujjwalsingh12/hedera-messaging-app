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

// Generate key pair for encryption and decryption
function generateKeyPair() {
    const { publicKey, privateKey } = crypto.generateKeyPairSync('rsa', {
        modulusLength: 2048,
    });

    return { publicKey, privateKey };
}

// Generate keys for both sender and recipient
const { publicKey: recipientPublicKey, privateKey: recipientPrivateKey } = generateKeyPair();
console.log(recipientPublicKey)


// const fs = require('fs');
// const path = require('path');

// // Define the path to your PEM file
// const publicKeyPath = path.join(__dirname, 'publicKey.pem');
// let recipientPublicKey;
// // Read the public key from the file
// fs.readFile(publicKeyPath, 'utf8', (err, data) => {
//     if (err) {
//         console.error('Error reading the public key file:', err);
//         return;
//     }
//     recipientPublicKey = data;
//     console.log('Public Key:', data);
// });




// Function to encrypt the message
// Example: Encrypt the message using the recipient's public key
function encryptMessage(publicKey, message) {
    return crypto.publicEncrypt(publicKey, Buffer.from(message));
}
const encryptedMessage = encryptMessage(recipientPublicKey, "Hello, this is a secret message!");





// Replace with your topicId and encrypted message
sendEncryptedMessage("0.0.4842073", encryptedMessage);