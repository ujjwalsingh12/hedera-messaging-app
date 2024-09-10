
const { Client, TopicMessageQuery } = require("@hashgraph/sdk");
require("dotenv").config();

// Initialize Hedera client
const client = Client.forTestnet();
client.setOperator(process.env["HEDERA_ACCOUNT_ID2"], process.env["HEDERA_PRIVATE_KEY2"]);

/**
 * Subscribes to a Hedera topic and logs received messages.
 * @param {string} topicId - The ID of the Hedera topic to subscribe to.
 */










const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

const publicKeyPath = path.resolve(__dirname, 'publicKey.pem');
// Load keys from files
function loadKeyFromFile(filePath, passphrase) {
    try {
        return fs.readFileSync(filePath, 'utf8');
    } catch (error) {
        console.error(`Error loading key from ${filePath}:`, error);
        throw error;
    }
}

function verifySignatureWithPublicKey(publicKey, data, signature) {
    const verify = crypto.createVerify('SHA256');
    verify.update(data);
    verify.end();
    return verify.verify(publicKey, signature, 'base64');
}








const publicKey = loadKeyFromFile(publicKeyPath);



async function subscribeToTopic(topicId) {
    try {
        // Subscribe to the topic
        const subscriptionId = await new TopicMessageQuery()
            .setTopicId(topicId)
            .subscribe(client, (message) => {
                const messageContent = Buffer.from(message.contents).toString();
                const jsonmessage = JSON.parse(messageContent);
                console.log(`Received message: ${jsonmessage.testdata}`);
                console.log(`Received message: ${jsonmessage.signature}`);
                const isVerified = verifySignatureWithPublicKey(publicKey, jsonmessage.testdata, jsonmessage.signature);
                console.log('Is the signature valid?', isVerified);
                
            });

        console.log(`Subscribed to topic: ${topicId}`);
        console.log(`Subscription ID: ${subscriptionId}`);
    } catch (error) {
        console.error("Error subscribing to topic:", error);
    }
}

// Example usage: Replace with your topicId
const topicId = "0.0.4842073"; // Replace with actual topic ID
subscribeToTopic(topicId);








