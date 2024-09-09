const { Client, TopicMessageQuery } = require("@hashgraph/sdk");

require("dotenv").config();

const client = Client.forTestnet();
client.setOperator(process.env.HEDERA_ACCOUNT_ID2, process.env.HEDERA_PRIVATE_KEY2);

async function subscribeToTopic(topicId) {
    new TopicMessageQuery()
        .setTopicId(topicId)
        .subscribe(client, (message) => {
            const messageContent = Buffer.from(message.contents).toString();
            console.log(`Received message: ${messageContent}`);
        });
}

// Example: Replace with your topicId
subscribeToTopic("0.0.4842073");