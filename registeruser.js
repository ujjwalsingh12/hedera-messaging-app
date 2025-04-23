const {
    Client,
    PrivateKey,
    ContractExecuteTransaction,
    ContractFunctionParameters
} = require("@hashgraph/sdk");

// Define your credentials
const accountId = "0.0.4515812";
const privateKey = PrivateKey.fromString("3030020100300706052b8104000a042204209c4ef546bcda3d7cc377d1acfe9036828e1e1c3e2129e4d0f245132302da5c76");

// Setup Hedera client
const client = Client.forTestnet().setOperator(accountId, privateKey);

// Contract ID on Hedera testnet
const contractId = "0.0.5892050"; //"0.0.5861199";

// JSON metadata
const userMetadata = {
    name: "John Doe",
    age: 30,
    email: "johndoe@example.com"
};

// Convert to string
const metadataString = JSON.stringify(userMetadata);

async function registerUser() {
    try {
        // Prepare the contract call with correct parameter type
        const transaction = await new ContractExecuteTransaction()
            .setContractId(contractId)
            .setGas(700000) // Adjust gas limit as needed
            .setFunction(
                "registerUser",
                new ContractFunctionParameters().addString(metadataString)
            );

        // Submit the transaction
        const txResponse = await transaction.execute(client);

        // Get the receipt
        const receipt = await txResponse.getReceipt(client);
        console.log("✅ User registered. Status:", receipt.status.toString());

    } catch (err) {
        console.log("Error:", err.code);
        if (true) {  // 4001 is the common error code for contract revert
            const revertMessage = err.message; // Extract the message after 'revert'
            console.error(`❌ Error during contract execution: ${revertMessage}xxxxxx`);
        } else {
            console.error("❌ Error during contract execution:", err);
        }
    }
}

registerUser();