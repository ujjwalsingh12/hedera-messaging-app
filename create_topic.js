const { Client, TopicCreateTransaction } = require("@hashgraph/sdk");

require("dotenv").config();

const client = Client.forTestnet();
client.setOperator(process.env.HEDERA_ACCOUNT_ID, process.env.HEDERA_PRIVATE_KEY);

async function createTopic() {
    const transaction = new TopicCreateTransaction();
    const receipt = await (await transaction.execute(client)).getReceipt(client);
    const topicId = receipt.topicId;
    console.log(`Topic created with ID: ${topicId}`);
    return topicId;
}

createTopic();