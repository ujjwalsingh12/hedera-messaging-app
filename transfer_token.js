// Import necessary classes from the SDK
const { Client, TransferTransaction, Hbar, PrivateKey } = require('@hashgraph/sdk');


async function transferTokens(operatorId,pk,tokenId,recipientAccountId,amount) {
    // Configure your client with the operator account
    const client = Client.forTestnet(); // Use Client.forMainnet() for mainnet
    // const operatorId = '0.0.4515812'; // Replace with your operator account ID
    // const pk = '3030020100300706052b8104000a042204209c4ef546bcda3d7cc377d1acfe9036828e1e1c3e2129e4d0f245132302da5c76';
    const operatorPrivateKey = PrivateKey.fromString(pk); // Replace with your operator private key
    client.setOperator(operatorId, operatorPrivateKey);
    
    // Define the token ID and account IDs involved in the transfer
    // const tokenId = '0.0.4842692'; // Replace with your token ID
    const senderAccountId = operatorId; // Replace with the sender account ID
    // const recipientAccountId = '0.0.4819262'; // Replace with the recipient account ID
    let resp="";
    try {
        // Create a Token Transfer Transaction
        const tokenTransferTx = new TransferTransaction()
            .addTokenTransfer(tokenId, senderAccountId, -1*amount) // Subtract 1 token from the sender
            .addTokenTransfer(tokenId, recipientAccountId, amount) // Add 1 token to the recipient
            .freezeWith(client); // Freeze the transaction

        // Sign the transaction
        const signTx = await tokenTransferTx.sign(operatorPrivateKey);

        // Submit the transaction to the Hedera network
        const txResponse = await signTx.execute(client);

        // Get the receipt of the transaction
        const receipt = await txResponse.getReceipt(client);
        console.log(receipt);
        // Log the transaction status
        resp = `Transaction Status: ${receipt.status.toString()}`;
    } catch (error) {
        resp = "Error transferring tokens:";
    }
    return resp;
}

module.exports = {transferTokens};

// Call the function to perform the token transfer
// console.log(transferTokens('0.0.4515812','3030020100300706052b8104000a042204209c4ef546bcda3d7cc377d1acfe9036828e1e1c3e2129e4d0f245132302da5c76','0.0.4842692','0.0.4819262',1));
