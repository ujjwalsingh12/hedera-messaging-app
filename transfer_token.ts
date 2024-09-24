// Import necessary classes from the SDK
const { Client, TransferTransaction, Hbar, PrivateKey } = require('@hashgraph/sdk');

// Configure your client with the operator account
const client = Client.forTestnet(); // Use Client.forMainnet() for mainnet
const operatorId = '0.0.4515812'; // Replace with your operator account ID
const operatorPrivateKey = PrivateKey.fromString('3030020100300706052b8104000a042204209c4ef546bcda3d7cc377d1acfe9036828e1e1c3e2129e4d0f245132302da5c76'); // Replace with your operator private key
client.setOperator(operatorId, operatorPrivateKey);

// Define the token ID and account IDs involved in the transfer
const tokenId = '0.0.4842692'; // Replace with your token ID
const senderAccountId = '0.0.4515812'; // Replace with the sender account ID
const recipientAccountId = '0.0.4819262'; // Replace with the recipient account ID

async function transferTokens() {
    try {
        // Create a Token Transfer Transaction
        const tokenTransferTx = new TransferTransaction()
            .addTokenTransfer(tokenId, senderAccountId, -1) // Subtract 1 token from the sender
            .addTokenTransfer(tokenId, recipientAccountId, 1) // Add 1 token to the recipient
            .freezeWith(client); // Freeze the transaction

        // Sign the transaction
        const signTx = await tokenTransferTx.sign(operatorPrivateKey);

        // Submit the transaction to the Hedera network
        const txResponse = await signTx.execute(client);

        // Get the receipt of the transaction
        const receipt = await txResponse.getReceipt(client);

        // Log the transaction status
        console.log(`Transaction Status: ${receipt.status.toString()}`);
    } catch (error) {
        console.error("Error transferring tokens:", error);
    }
}

// Call the function to perform the token transfer
transferTokens();
