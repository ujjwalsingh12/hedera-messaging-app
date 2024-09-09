const { Client, TopicMessageQuery } = require("@hashgraph/sdk");
require("dotenv").config();

// Initialize Hedera client
const client = Client.forTestnet();
client.setOperator(process.env.HEDERA_ACCOUNT_ID2, process.env.HEDERA_PRIVATE_KEY2);

/**
 * Subscribes to a Hedera topic and logs received messages.
 * @param {string} topicId - The ID of the Hedera topic to subscribe to.
 */
async function subscribeToTopic(topicId) {
    try {
        // Subscribe to the topic
        const subscriptionId = await new TopicMessageQuery()
            .setTopicId(topicId)
            .subscribe(client, (message) => {
                const messageContent = Buffer.from(message.contents).toString();
                console.log(`Received message: ${messageContent}`);
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
