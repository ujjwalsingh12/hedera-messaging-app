const { Client, PrivateKey, AccountId, ContractExecuteTransaction, ContractFunctionParameters } = require('@hashgraph/sdk');

// Hedera Account ID and Private Key
const accountId = AccountId.fromString("0.0.4819262");
const privateKey = PrivateKey.fromString("3030020100300706052b8104000a0422042022eb8de6966d23dea56a7217f21644438765272d1a03c7a961ba1b126fba94d0");

// Hedera Client Setup (testnet example)
const client = Client.forTestnet();
client.setOperator(accountId, privateKey);

// Hedera Contract IDs (replace with actual Hedera Contract IDs)
const product_registry_address = "0.0.5902244"; // Example product registry contract ID
const user_registry_address = "0.0.5892050";   // Example user registry contract ID

// Function to register a user
async function registerUser(userMetadata) {
    try {
        // Ensure valid metadata format
        if (typeof userMetadata !== 'string' || !isValidJson(userMetadata)) {
            console.log('Invalid metadata format');
            return;
        }
        console.log('User Metadata:', userMetadata);
        // Increase gas limit (for example, 5,000,000 gas units)
        const transaction = await new ContractExecuteTransaction()
            .setContractId(user_registry_address) // Contract ID for User Registry
            .setFunction('registerUser', new ContractFunctionParameters().addString(userMetadata))
            .setGas(5000000) // Set an appropriate gas limit (example: 5,000,000)
            .execute(client);
        console.log('Transaction ID:', transaction.transactionId.toString());
        // Wait for the receipt to confirm the transaction
        const receipt = await transaction.getReceipt(client);
        console.log(`User registration status: ${receipt.status}`);
    } catch (error) {
        console.error('Error registering user:', error);
    }
}

// Function to register a product
async function registerProduct(productName, totalUnits, price, productMetadata) {
    try {
        // Ensure valid metadata format
        if (typeof productMetadata !== 'string' || !isValidJson(productMetadata)) {
            console.log('Invalid metadata format');
            return;
        }

        // Increase gas limit (for example, 5,000,000 gas units)
        const transaction = await new ContractExecuteTransaction()
            .setContractId(product_registry_address) // Contract ID for Product Registry
            .setFunction('registerProduct', new ContractFunctionParameters()
                .addString(productName)
                .addInt64(totalUnits)
                .addInt64(price)
                .addString(productMetadata))
            .setGas(10000000) // Set an appropriate gas limit (example: 5,000,000)
            .execute(client);

        // Wait for the receipt to confirm the transaction
        const receipt = await transaction.getReceipt(client);
        console.log(`Product registration status: ${receipt.status}`);
    } catch (error) {
        console.error('Error registering product:', error);
    }
}

// Helper function to check if metadata is valid JSON
function isValidJson(metadata) {
    try {
        JSON.parse(metadata);
        return true;
    } catch (e) {
        return false;
    }
}

//Example usage of registering a user and product
// const userMetadata = '{"name": "John Doe", "email": "john@example.com"}';
// registerUser(userMetadata);

const productName = "Smartphone Model X";
const totalUnits = 100;
const price = 500; // Price per unit in tokens
const productMetadata = '{"brand": "BrandX", "features": "5G, 128GB storage, 8GB RAM"}';
registerProduct(productName, totalUnits, price, productMetadata);