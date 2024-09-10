const { Client, AccountId, PrivateKey, TransferTransaction, Hbar } = require('@hashgraph/sdk');

require("dotenv").config();
async function transferHbar(sender,receiver) {


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
        .addHbarTransfer(senderAccountId, new Hbar(-10)) // Amount to send (e.g., -10 HBAR)
        .addHbarTransfer(receiverAccountId, new Hbar(10)) // Amount to receive (e.g., 10 HBAR)
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








const ss = '{"account_id": "0.0.4515812", "private_key": "3030020100300706052b8104000a042204209c4ef546bcda3d7cc377d1acfe9036828e1e1c3e2129e4d0f245132302da5c76"}';
const sd = '{"account_id": "0.0.4819262", "private_key": "3030020100300706052b8104000a0422042022eb8de6966d23dea56a7217f21644438765272d1a03c7a961ba1b126fba94d0"}';

transferHbar(sd,ss)
// module.exports {transferHbar };
