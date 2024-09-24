const { Client, TopicCreateTransaction } = require("@hashgraph/sdk");

require("dotenv").config();


async function createTopic(account_id,priv_key) {
    const client = Client.forTestnet();
    client.setOperator(account_id,priv_key);
    const transaction = new TopicCreateTransaction();
    const receipt = await (await transaction.execute(client)).getReceipt(client);
    const topicId = receipt.topicId;
    console.log(`Topic created with ID: ${topicId}`);
    return topicId;
}

const account = require('./keys.json');
createTopic(account[4].account_id,account[4].private_key);

module.exports = { createTopic };


