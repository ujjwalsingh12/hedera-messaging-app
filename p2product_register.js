const {
    Client,
    PrivateKey,
    AccountId,
    ContractExecuteTransaction,
    ContractFunctionParameters,
    ContractCallQuery
} = require('@hashgraph/sdk');

// Hedera Account ID and Private Key
const accountId = AccountId.fromString("0.0.4819262");
const privateKey = PrivateKey.fromString("3030020100300706052b8104000a0422042022eb8de6966d23dea56a7217f21644438765272d1a03c7a961ba1b126fba94d0");

// Hedera Client Setup (testnet example)
const client = Client.forTestnet();
client.setOperator(accountId, privateKey);

// Hedera Contract IDs (replace with actual Hedera Contract IDs)
const product_registry_address = "0.0.5910569"; // Example product registry contract ID
const user_registry_address = "0.0.5908158"; // Example user registry contract ID

// Step 1: Check if the user is registered first
async function checkUserRegistration() {
    try {
        console.log('Checking if user is registered...');

        const query = new ContractCallQuery()
            .setContractId(user_registry_address)
            .setGas(100000)
            .setFunction("checkUserRegistration", new ContractFunctionParameters().addAddress(accountId.toSolidityAddress()));

        const result = await query.execute(client);
        const isRegistered = result.getBool();

        console.log(`User registration status: ${isRegistered ? 'Registered' : 'Not Registered'}`);
        return isRegistered;
    } catch (error) {
        console.error('Error checking user registration:', error);
        return false;
    }
}

// Function to register a user
async function registerUser(userMetadata) {
    try {
        // Ensure valid metadata format
        if (typeof userMetadata !== 'string' || !isValidJson(userMetadata)) {
            console.log('Invalid metadata format');
            return;
        }

        console.log('User Metadata:', userMetadata);

        // Increase gas limit
        const transaction = await new ContractExecuteTransaction()
            .setContractId(user_registry_address)
            .setFunction('registerUser', new ContractFunctionParameters().addString(userMetadata))
            .setGas(500000)
            .execute(client);

        console.log('Transaction ID:', transaction.transactionId.toString());

        // Wait for the receipt to confirm the transaction
        const receipt = await transaction.getReceipt(client);
        console.log(`User registration status: ${receipt.status}`);

        return receipt.status.toString() === 'SUCCESS';
    } catch (error) {
        console.error('Error registering user:', error);
        throw error; // Re-throw to handle in the main function
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

        console.log('Registering product:', productName);
        console.log('Total Units:', totalUnits);
        console.log('Price:', price);
        console.log('Product Metadata:', productMetadata);

        // Increase gas limit
        const transaction = await new ContractExecuteTransaction()
            .setContractId(product_registry_address)
            .setFunction('registerProduct', new ContractFunctionParameters()
                .addString(productName)
                .addInt64(totalUnits)
                .addInt64(price)
                // .addString(productMetadata)
            )
            .setGas(5000000)
            .execute(client);

        console.log('Transaction ID:', transaction.transactionId.toString());

        // Wait for the receipt to confirm the transaction
        const receipt = await transaction.getReceipt(client);
        console.log(`Product registration status: ${receipt.status}`);

        return receipt.status.toString() === 'SUCCESS';
    } catch (error) {
        console.error('Error registering product. Full error details:', error);
        throw error; // Re-throw to handle in the main function
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

// Main execution function
async function main() {
    try {
        // Check if user is registered first
        const isRegistered = await checkUserRegistration();

        // If not registered, register the user first
        if (!isRegistered) {
            console.log('User not registered. Registering user first...');
            const userMetadata = '{"name": "John Doe", "email": "john@example.com"}';
            await registerUser(userMetadata);
        }

        // Now register the product
        const productName = "Smartphone Model X";
        const totalUnits = 100;
        const price = 500; // Price per unit in tokens
        const productMetadata = '{"brand": "BrandX", "features": "5G, 128GB storage, 8GB RAM"}';

        await registerProduct(productName, totalUnits, price, productMetadata);

    } catch (error) {
        console.error('Operation failed:', error);
    }
}

// Execute the main function
main();