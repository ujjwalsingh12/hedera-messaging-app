require("dotenv").config();
const { Client, TopicCreateTransaction } = require("@hashgraph/sdk");

// Create Hedera Client for Testnet
const client = Client.forTestnet();
client.setOperator(process.env.HEDERA_ACCOUNT_ID, process.env.HEDERA_PRIVATE_KEY);

// Function to create a topic
async function createTopic() {
    const transaction = new TopicCreateTransaction();
    const receipt = await (await transaction.execute(client)).getReceipt(client);
    const topicId = receipt.topicId;
    console.log(`Topic created with ID: ${topicId}`);
    return topicId;
}

// Call the createTopic function to create a Hedera topic
// createTopic();

const { TopicMessageQuery } = require("@hashgraph/sdk");

async function subscribeToTopic(topicId) {
    new TopicMessageQuery()
        .setTopicId(topicId)
        .subscribe(client, (message) => {
            console.log(`Received message: ${Buffer.from(message.contents).toString()}`);
        });
}

// Example: Replace with the actual topic ID
const topicId = "0.0.4842073";
subscribeToTopic(topicId);