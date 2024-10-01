const { Client, TopicMessageQuery } = require("@hashgraph/sdk");
require("dotenv").config();

const accounts = require('./keys.json');

async function fetch_messages(account_num, topic_id, duration = 10000) { // duration in milliseconds
    const messageList = [];
    const client = Client.forTestnet().setOperator(accounts[account_num].account_id, accounts[account_num].private_key);

    const messageQuery = new TopicMessageQuery()
        .setTopicId(topic_id)
        .setStartTime(0);

    const subscription = messageQuery.subscribe(client, (message) => {
        const decodedMessage = Buffer.from(message.contents, "utf8").toString();
        
        // Add the message to the list
        messageList.push(decodedMessage);
    });

    // Set a timeout to unsubscribe after a certain duration
    setTimeout(() => {
        // console.log("Duration reached. Stopping subscription.");
        // subscription(); // Unsubscribe to stop receiving messages
    }, duration);

    // Wait for the subscription to complete
    return new Promise((resolve) => {
        const checkCompletion = setInterval(() => {
            if (messageList.length > 0) {
                // Optional: You can also log the messages as they are received
                // console.log("Messages received so far:", messageList);
            }
        }, 1000);

        // Resolve after the duration has passed
        setTimeout(() => {
            clearInterval(checkCompletion);
            resolve(JSON.stringify(messageList));
        }, duration);
    });
}

// Fetch messages with a duration of 10 seconds

// async function fetch_messages(account_num,topic_id) {
//     let g = [];
//     await fetch_messages_in(account_num,topic_id, 5000).then((messages) => {
//         // console.log("Final messages:", messages);
//         g = messages;
//     }).catch((error) => {
//         // console.error("Error fetching messages:", error);
//         g = [];
//     });
//     return g;
// }
// console.log(fetch_messages(0, "0.0.4842073", 10000));
    // fetch_messages(0, "0.0.4842073", 10000).then((messages) => {
    //     console.log("Final messages:", messages);
    // }).catch((error) => {
    //     console.error("Error fetching messages:", error);
    // });
    

module.exports = { fetch_messages };





















// const { Client, TopicMessageQuery } = require("@hashgraph/sdk");
// require("dotenv").config();

// const accounts = require('./keys.json');

// async function fetch_messages(account_num, topic_id, messageLimit = 10) {
//     const messageList = [];
//     const client = Client.forTestnet().setOperator(accounts[account_num].account_id, accounts[account_num].private_key);

//     const messageQuery = new TopicMessageQuery()
//         .setTopicId(topic_id)
//         .setStartTime(0);

//     const subscription = messageQuery.subscribe(client, (message) => {
//         const decodedMessage = Buffer.from(message.contents, "utf8").toString();
        
//         // Add the message to the list
//         messageList.push(decodedMessage);

//         // Check if we've reached the limit
//         if (messageList.length >= messageLimit) {
//             console.log("Message limit reached. Stopping subscription.");
//             // subscription.unsubscribe(); // Unsubscribe to stop receiving messages
//         }
//     });

//     // Optional: You can also set a timeout to stop after a certain duration
//     const timeout = setTimeout(() => {
//         console.log("Timeout reached. Stopping subscription.");
//         // subscription.unsubscribe(); // Unsubscribe to stop receiving messages
//     }, 60000); // 60 seconds timeout

//     // Wait for the subscription to complete
//     return new Promise((resolve) => {
//         const checkCompletion = setInterval(() => {
//             if (messageList.length >= messageLimit) {
//                 clearInterval(checkCompletion);
//                 clearTimeout(timeout);
//                 resolve(JSON.stringify(messageList));
//             }
//         }, 1000);
//     });
// }

// fetch_messages(0, "0.0.4842073", 5).then((messages) => {
//     console.log(messages);
// }).catch((error) => {
//     console.error("Error fetching messages:", error);
// });

// module.exports = { fetch_messages };






















// const { Client, TopicCreateTransaction, TopicMessageQuery, TopicMessageSubmitTransaction } = require("@hashgraph/sdk");

// require("dotenv").config();

// const accounts = require('./keys.json');
// async function fetch_messages(account_num,topic_id) {
//     const messageList = [];
//     const client = Client.forTestnet().setOperator(accounts[account_num].account_id,accounts[account_num].private_key);
//         const g = await new TopicMessageQuery()
//             // .setTopicId("0.0.4842073")
//             .setTopicId(topic_id)
//             .setStartTime(0)
//             .subscribe(
//                     client,
//                     (message) => {
//                         const decodedMessage = Buffer.from(message.contents, "utf8").toString();
//                         // console.log(decodedMessage); // Log the message to the console
                        
//                         // Add the message to the list
//                         messageList[messageList.length]= decodedMessage.toString();
//                     }
//                 );
//                 // console.log(g);
//                 console.log(messageList)
//                 return JSON.stringify(messageList);
//         }
// fetch_messages(0,"0.0.4842073");
//         module.exports = {fetch_messages};
        
























        // const { TopicMessageQuery } = require("@hashgraph/sdk"); // Adjust the import according to your SDK version
        
        // Assuming client is already created and topic_id is defined
//         const topic_id = "0.0.4893302"; // Replace with your actual topic ID
        
//         // Initialize an array to store messages
//         const messageList = [];
        
//         const accounts = require('./keys.json');
//     const client = Client.forTestnet().setOperator(accounts[0].account_id,accounts[0].private_key);
// // Subscribe to the topic
// new TopicMessageQuery()
//     .setTopicId(topic_id)
//     .setStartTime(0)
//     .subscribe(
//         client,
//         (message) => {
//             const decodedMessage = Buffer.from(message.contents, "utf8").toString();
//             console.log(decodedMessage); // Log the message to the console
            
//             // Add the message to the list
//             messageList.push(decodedMessage);
//         }
//     );

// // Function to retrieve messages
// function getMessages() {
//     return messageList;
// }

// // Example: Log the message list after a certain period
// setTimeout(() => {
//     console.log("All messages received:", getMessages());
// }, 10000); // Adjust the timeout as needed
