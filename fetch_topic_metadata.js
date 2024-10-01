const { Client, TopicInfoQuery } = require("@hashgraph/sdk");
require("dotenv").config();

const accounts = require('./keys.json');

async function fetch_topic_metadata(account_num, topic_id) {
    const client = Client.forTestnet().setOperator(
        accounts[account_num].account_id,
        accounts[account_num].private_key
    );

    try {
        // Create and execute a TopicInfoQuery
        const topicInfo = await new TopicInfoQuery()
            .setTopicId(topic_id)
            .execute(client);
        // console.log(topicInfo);
        // Display the fetched metadata
        console.log(`Topic ID: ${topicInfo.topicId}`);
        console.log(`Topic Memo: ${topicInfo.topicMemo.toString()}`);
        // console.log(`Topic Admin Key: ${topicInfo.adminKey ? topicInfo.adminKey.toString() : 'None'}`);
        // console.log(`Topic Submit Key: ${topicInfo.submitKey ? topicInfo.submitKey.toString() : 'None'}`);
        // console.log(`Created Timestamp: ${Date.parse(topicInfo.created).toString()}`);
        // console.log(`Updated Timestamp: ${Date.parse(topicInfo.updated).toString()}`);
        // console.log(`Deleted: ${topicInfo.deleted}`);

        return topicInfo.topicMemo.toString();
    } catch (error) {
        console.error("Error fetching topic metadata:", error);
    }
}

module.exports = {fetch_topic_metadata};
// Replace with your account number and topic ID
// fetch_topic_metadata(0, "0.0.4930186");
