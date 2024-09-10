const { Client, AccountId, PrivateKey, TransferTransaction, Hbar } = require('@hashgraph/sdk');

require("dotenv").config();
async function transferHbar() {
    // Configure your Hedera client
    const client = Client.forTestnet(); // Use .forMainnet() for mainnet
    client.setOperator(process.env["HEDERA_ACCOUNT_ID"],process.env["HEDERA_PRIVATE_KEY"]);

    // Define the sender and receiver account IDs
    const senderAccountId = process.env["HEDERA_ACCOUNT_ID"];
    const receiverAccountId = process.env["HEDERA_ACCOUNT_ID2"];

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

transferHbar();
