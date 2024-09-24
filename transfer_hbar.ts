const { Client, AccountId, PrivateKey, TransferTransaction, Hbar } = require('@hashgraph/sdk');

require("dotenv").config();
async function transferHbar(sender,receiver,amount) {


    let jsonString = sender;
    
    // Convert string to JSON
    let senderObject;
    try {
        senderObject = JSON.parse(jsonString);
    } catch (error) {
        console.error('Error parsing JSON:', error.message);
    }
    
    // Extract specific keys from JSON
    if (senderObject) {
        const accountId = senderObject.account_id;
        const privateKey = senderObject.private_key;
    
        console.log('Sender Account ID:', accountId);
        console.log('Sender Private Key:', privateKey);
    }

    jsonString = receiver;
    let receiverObject;
    // Convert string to JSON
    try {
        receiverObject = JSON.parse(jsonString);
    } catch (error) {
        console.error('Error parsing JSON:', error.message);
    }
    
    // Extract specific keys from JSON
    if (receiverObject) {
        const accountId = receiverObject.account_id;
        console.log('Receiver Account ID:', accountId);
    }

    





    // Configure your Hedera client
    const client = Client.forTestnet(); // Use .forMainnet() for mainnet
    client.setOperator(senderObject.account_id,senderObject.private_key);

    // Define the sender and receiver account IDs
    const senderAccountId = senderObject.account_id;
    const receiverAccountId = receiverObject.account_id;

    // Create the transaction
    const transaction = new TransferTransaction()
        .addHbarTransfer(senderAccountId, new Hbar(-1*amount)) // Amount to send (e.g., -10 HBAR)
        .addHbarTransfer(receiverAccountId, new Hbar(amount)) // Amount to receive (e.g., 10 HBAR)
        .setMaxTransactionFee(new Hbar(1)); // Set max transaction fee
    
    // Sign and submit the transaction
    try {
        const response = await transaction.execute(client);
        const receipt = await response.getReceipt(client);
        console.log(`Transaction status: ${receipt.status.toString()}`);
    } catch (error) {
        console.error('Error executing transaction:', error);
    }
}






const accounts = require('./keys.json');

const ss = JSON.stringify(accounts[4]);
const sd = JSON.stringify(accounts[0]);
const amount = 70;
transferHbar(ss,sd,amount);
// module.exports {transferHbar };
