const { Client, TopicMessageSubmitTransaction,PrivateKey, AccountId, PublicKey } = require("@hashgraph/sdk");

require("dotenv").config();
const account = require('./keys.json');
const { sign, Signature } = require("noble-ed25519");
const client = Client.forTestnet();

async function sendEncryptedMessage(topicId, encryptedMessage,client) {
    const transaction = new TopicMessageSubmitTransaction({
        topicId: topicId,
        message: encryptedMessage.toString('base64')  // Convert the encrypted message to base64 format
    });
    
    const response = await transaction.execute(client);
    const receipt = await response.getReceipt(client);
    
    console.log(`Encrypted message sent to topic: ${topicId}`);
    return `Encrypted message sent to topic: ${topicId}`;
}


async function signMessage(privateKey,message,client) {
    const signature = privateKey.sign(message);
    // console.log(signature.hex());
    // console.log("Signature: ", signature.toString());
    return signature;
}


async function send_message(testData,account_num,topicId){
    client.setOperator(account[account_num].account_id, account[account_num].private_key);
    const privateKey = PrivateKey.fromString(account[0].private_key);
    const signature = await signMessage(privateKey, testData,client);
    console.log('Signature:', signature);
    const message = { "testdata": testData, "signature":Buffer.from(signature).toString('hex')};
    return sendEncryptedMessage(topicId, JSON.stringify(message),client);

}
const topicId = "0.0.4842073";


module.exports = {send_message};



// Replace with your topicId and encrypted message
// send_msg();

// const args = process.argv.slice(2); // Slice to skip the first two elements

// if (args.length === 0) {
//     console.log('No arguments provided.');
    
// } else {
//     console.log('Message is: ');
//     let s = "";
//     args.forEach((arg, index) => {  
//         s = s + " " + arg;
//     });
//     testData = s.substring(1);
//     send(testData,0,topicId);
// }