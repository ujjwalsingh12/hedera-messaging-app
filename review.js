const {
    Client,
    AccountId,
    PrivateKey,
    ContractId,
    ContractExecuteTransaction,
    ContractFunctionParameters,
    Hbar,
} = require("@hashgraph/sdk");

// Replace with your Hedera Testnet credentials
const operatorId = AccountId.fromString("0.0.4515812");  // Your operator account ID
const operatorKey = PrivateKey.fromString("3030020100300706052b8104000a042204209c4ef546bcda3d7cc377d1acfe9036828e1e1c3e2129e4d0f245132302da5c76");  // Your private key
const contractId = ContractId.fromString("0.0.5917455"); // Your deployed smart contract ID

// Create a Hedera client
const client = Client.forTestnet().setOperator(operatorId, operatorKey);

// Function to execute a contract method
async function callSubmitReview(productAddress, reviewText) {
    try {
        const contractExecuteTx = await new ContractExecuteTransaction()
            .setContractId(contractId)
            .setGas(100000) // Set the gas limit
            .setFunction(
                "submitReview", // Function name in the smart contract
                new ContractFunctionParameters()
                    .addAddress(productAddress) // Add product address (as AccountId or Address)
                    .addString(reviewText) // Add review text
            )
            .execute(client);

        const receipt = await contractExecuteTx.getReceipt(client);
        console.log("Transaction status:", receipt.status.toString());

        // Fetch the transaction's record (this will give us detailed info)
        const record = await contractExecuteTx.getRecord(client);
        console.log("Transaction record:", record);

        // You can check logs in the record (if your contract generates them)
        console.log("Logs:", record.logs);
    } catch (error) {
        console.error("Error executing contract:", error);
    }
}

// Convert hexadecimal product address to AccountId
const productAddress = AccountId.fromString("0x4fc5055d1ba62775c0fbf6d7cdcf656155f8ae12");

// Call the function with example parameters
callSubmitReview(productAddress, "This product is amazing!");