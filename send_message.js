const { Client, TopicMessageSubmitTransaction } = require("@hashgraph/sdk");

require("dotenv").config();

const client = Client.forTestnet();
client.setOperator(process.env["HEDERA_ACCOUNT_ID"], process.env["HEDERA_PRIVATE_KEY"]);

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
// const testData = 'sdafasf';




function send(testData){

    const signature = signDataWithPrivateKey(privateKey, testData);
    console.log('Signature:', signature);
    const message = { "testdata": testData, "signature":signature};
    sendEncryptedMessage("0.0.4842073", JSON.stringify(message));
    const g = JSON.stringify(message);
    console.log(message.testdata);

}






// Replace with your topicId and encrypted message
// send_msg();

const args = process.argv.slice(2); // Slice to skip the first two elements

if (args.length === 0) {
    console.log('No arguments provided.');
} else {
    console.log('Message is: ');
    let s = "";
    args.forEach((arg, index) => {
        s = s + " " + arg;
    });
    testData = s.substring(1);
    send(testData);
}