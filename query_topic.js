// const { Client, TopicMessageQuery } = require("@hashgraph/sdk");
// require("dotenv").config();
// const client = Client.forTestnet();
// client.setOperator(process.env["HEDERA_ACCOUNT_ID2"], process.env["HEDERA_PRIVATE_KEY2"]);

// async function queryTopicMessages(topicId) {
//     const messages = [];
//     let startTime = 0; // Start time in milliseconds

//     while (true) {
//         const query = new TopicMessageQuery()
//             .setTopicId(topicId)
//             .setStartTime(startTime)
//             .setLimit(10); // Number of messages to retrieve per query

//         const response = await query.execute(client);

//         if (response.length === 0) break; // Break if no messages are returned

//         response.forEach(message => {
//             messages.push(message.body);
//             // Update start time to the latest message's timestamp for pagination
//             startTime = message.consensusTimestamp.toMilliseconds();
//         });
//     }

//     return messages;
// }

// const topicId = "0.0.4842073"; // Replace with your topic ID
// queryTopicMessages(topicId).then(messages => {
//     console.log("Messages in topic:", messages);
// }).catch(err => {
//     console.error("Error querying messages:", err);
// });

const axios = require('axios');

// Replace with the URL of the API you want to call


async function query_topic(topicId) {
    const apiUrl = `https://testnet.mirrornode.hedera.com/api/v1/topics/${topicId}/messages`;
    try {
        const response = await axios.get(apiUrl);
        console.log('Data:', response.data);
        return JSON.stringify(response.data);
    } catch (error) {
        console.error('Error fetching data:', error);
        return null;
    }
}

module.exports = {query_topic};

query_topic('0.0.4893302');
