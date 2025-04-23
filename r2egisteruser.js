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
const contractId = "0.0.5891934"; // Contract ID for TrustToken on Hedera testnet

// JSON metadata
const userMetadata = {
    name: "John Doe",
    age: 30,
    email: "johndoe@example.com"
};

// Convert the metadata to string
const metadataString = JSON.stringify(userMetadata);

async function registerUser() {
    try {
        // Prepare the contract call with the correct parameter type (string for metadata)
        const transaction = await new ContractExecuteTransaction()
            .setContractId(contractId)
            .setGas(700000) // Adjust the gas limit as needed
            .setFunction(
                "registerUser",  // Function name in the contract
                new ContractFunctionParameters().addString(metadataString)  // Pass the metadata string
            );

        // Submit the transaction
        const txResponse = await transaction.execute(client);

        // Wait for the transaction receipt
        const receipt = await txResponse.getReceipt(client);

        // Check if the transaction was successful
        console.log("✅ User registered. Status:", receipt.status.toString());
    } catch (err) {
        console.error("❌ Error during contract execution:", err);
    }
}

// Call the function to register the user
registerUser();