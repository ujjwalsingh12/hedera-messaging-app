const { Client, TopicMessageSubmitTransaction } = require("@hashgraph/sdk");

require("dotenv").config();

const client = Client.forTestnet();
client.setOperator(process.env.HEDERA_ACCOUNT_ID, process.env.HEDERA_PRIVATE_KEY);

async function sendMessage(topicId, message) {
    const transaction = new TopicMessageSubmitTransaction({
        topicId: topicId,
        message: message
    });

    const response = await transaction.execute(client);
    const receipt = await response.getReceipt(client);

    console.log(`Message sent to topic: ${topicId}`);
}

// Example: Replace with your topicId and message
sendMessage("0.0.4842073", "Hello, this is a test message!");