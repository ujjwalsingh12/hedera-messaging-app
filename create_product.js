// Example in JavaScript using Hedera SDK
const { Client, TopicCreateTransaction, TopicMessageQuery, TopicMessageSubmitTransaction } = require("@hashgraph/sdk");
const account = require('./keys.json');
const {fetch_topic_metadata} = require('./fetch_topic_metadata');

// Create a client instance
const client = Client.forTestnet(); // or Client.forMainnet() for the mainnet

// Set your operator account ID and private key


async function createProduct(Product_name) {
    const transaction = new TopicCreateTransaction()
    .setTopicMemo(`${Product_name}`);
    const receipt = await (await transaction.execute(client)).getReceipt(client);
    const topicId = receipt.topicId;
    console.log(`${Product_name} created with ID: ${topicId}`);
    
    return topicId;
}

// const topicId = "0.0.4843992";

async function updateProduct(productId,centralTopic){
    const transaction = new TopicMessageSubmitTransaction({
        topicId: centralTopic,  // Convert the encrypted message to base64 format
        message: productId,
    });
    const response = await transaction.execute(client);
    const receipt = await response.getReceipt(client);
    const pro = await fetch_topic_metadata(0, productId); 
    console.log(`${pro} product added to topic: ${productId}`);
}

async function create_product(centralTopic,account_num,Product_name){
    
    client.setOperator(account[account_num].account_id, account[account_num].private_key);
    const topicId = await createProduct(Product_name);
    // console.log(topicId); 
    console.log(centralTopic," will be updated with ",topicId.toString());
    updateProduct(topicId.toString(),centralTopic);
    return topicId; //////////////////////////////////////////////////////////////////////////////////
    
}
module.exports = {create_product};
// const args = process.argv.slice(2); // Slice to skip the first two elements
// if (args.length === 0) {
    // create_product("0.0.4893302",0,"Apple");
// } else {
    // addProduct(args[0],parseInt(args[1],10),args[2]);
// }


