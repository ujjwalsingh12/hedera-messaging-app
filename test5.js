const { Client, AccountId, PrivateKey, TransferTransaction, Hbar } = require('@hashgraph/sdk');

require("dotenv").config();
// async function transferHbar(sender,receiver,amount) {


    // let jsonString = sender;
    
    // // Convert string to JSON
    // let senderObject;
    // try {
    //     senderObject = JSON.parse(jsonString);
    // } catch (error) {
    //     console.error('Error parsing JSON:', error.message);
    // }
    
    // // Extract specific keys from JSON
    // if (senderObject) {
    //     const accountId = senderObject.account_id;
    //     const privateKey = senderObject.private_key;
    
    //     console.log('Sender Account ID:', accountId);
    //     console.log('Sender Private Key:', privateKey);
    // }

    // jsonString = receiver;
    // let receiverObject;
    // // Convert string to JSON
    // try {
    //     receiverObject = JSON.parse(jsonString);
    // } catch (error) {
    //     console.error('Error parsing JSON:', error.message);
    // }
    
    // // Extract specific keys from JSON
    // if (receiverObject) {
    //     const accountId = receiverObject.account_id;
    //     console.log('Receiver Account ID:', accountId);
    // }

    





//     // Configure your Hedera client
    // const client = Client.forTestnet(); // Use .forMainnet() for mainnet
    // client.setOperator(senderObject.account_id,senderObject.private_key);

//     // Define the sender and receiver account IDs
//     const senderAccountId = senderObject.account_id;
//     const receiverAccountId = receiverObject.account_id;

//     // Create the transaction
//     async function transferToken(params) {
//         const transaction = await new TransferTransaction()
//         .addTokenTransfer("0.0.4842692",senderAccountId, -1)
//         .addTokenTransfer("0.0.4842692",receiverAccountId, 1)
//         .freezeWith(client);

//     // Sign and submit the transaction
    
//         const signTx = await transaction.sign(privateKey);
//         const response = await await signTx.execute(client);
//         const receipt = await response.getReceipt(client);
//         console.log(`Transaction status: ${receipt.status.toString()}`);

// }

// }




// const accounts = require('./keys.json');

// const ss = JSON.stringify(accounts[0]);
// const sd = JSON.stringify(accounts[1]);
// const amount = 70;
// transferHbar(ss,sd,amount);
// // module.exports {transferHbar };

//Create the transfer transaction


const client = Client.forTestnet(); // Use .forMainnet() for mainnet
client.setOperator("0.0.4515812","3030020100300706052b8104000a042204209c4ef546bcda3d7cc377d1acfe9036828e1e1c3e2129e4d0f245132302da5c76");
async function sned(params) {
    const transaction = await new TransferTransaction()
     .addTokenTransfer("0.0.4842692", "0.0.4515812", -1)
     .addTokenTransfer("0.0.4842692", "0.0.4819262", 1)
     .freezeWith(client);

//Sign with the sender account private key
const signTx = await transaction.sign("3030020100300706052b8104000a042204209c4ef546bcda3d7cc377d1acfe9036828e1e1c3e2129e4d0f245132302da5c76");

//Sign with the client operator private key and submit to a Hedera network
const txResponse = await signTx.execute(client);

//Request the receipt of the transaction
const receipt = await txResponse.getReceipt(client);

//Obtain the transaction consensus status
const transactionStatus = receipt.status;

console.log("The transaction consensus status " +transactionStatus.toString());
}
sned();

//v2.0.5
