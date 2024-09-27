const { Client, TopicInfoQuery, TopicMessageQuery, TopicMessageSubmitTransaction } = require("@hashgraph/sdk");
const account = require('./keys.json');
const client = Client.forTestnet(); 
const account_num = 0;
client.setOperator(account[account_num].account_id, account[account_num].private_key);


async function get_info(topic_id) {
    //Create the account info query
    const query = new TopicInfoQuery()
    .setTopicId(topic_id);

    //Submit the query to a Hedera network
    const info = await query.execute(client);

    //Print the account key to the console
    console.log(info.topicId.toString(),":",info.topicMemo);

//v2.0.0

}





const args = process.argv.slice(2); // Slice to skip the first two elements

if (args.length === 0) {
    get_info("0.0.4893302");
} else {
    get_info(args[0]);
}








// async function createProduct(Product_name) {
//     const transaction = new TopicCreateTransaction()
//     .setTopicMemo(`This is a product by ${client.account_id} with name : ${Product_name}`);
//     const receipt = await (await transaction.execute(client)).getReceipt(client);
//     const topicId = receipt.topicId;
//     console.log(`${Product_name} created with ID: ${topicId}`);
    
//     return topicId;
// }

// // const topicId = "0.0.4843992";

// async function updateProduct(productId,centralTopic){
//     const transaction = new TopicMessageSubmitTransaction({
//         topicId: centralTopic,  // Convert the encrypted message to base64 format
//         message: productId,
//     });
//     const response = await transaction.execute(client);
//     const receipt = await response.getReceipt(client);
    
//     console.log(`Following product added to topic: ${productId}`);
// }

// async function addProduct(centralTopic,account_num,Product_name){
    
//     client.setOperator(account[account_num].account_id, account[account_num].private_key);
//     const topicId = await createProduct(Product_name);
//     // console.log(topicId); 
//     console.log(centralTopic," will be updated with ",topicId.toString());
//     updateProduct(topicId.toString(),centralTopic);
// }
// // Get the receipt
// // addProduct("0.0.4893302",0,"Apple");




