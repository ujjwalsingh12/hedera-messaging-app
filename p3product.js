const {
    Client,
    PrivateKey,
    AccountId,
    ContractExecuteTransaction,
    ContractFunctionParameters,
    ContractCallQuery,
    Hbar
} = require('@hashgraph/sdk');

// Hedera Account ID and Private Key
const accountId = AccountId.fromString("0.0.4819262");
const privateKey = PrivateKey.fromString("3030020100300706052b8104000a0422042022eb8de6966d23dea56a7217f21644438765272d1a03c7a961ba1b126fba94d0");

// Hedera Client Setup (testnet example)
const client = Client.forTestnet();
client.setOperator(accountId, privateKey);

// Hedera Contract IDs (replace with actual Hedera Contract IDs)
const product_marketplace_address = "0.0.5910569"; // Example product marketplace contract ID
const user_registry_address = "0.0.5908158"; // Example user registry contract ID

// Step 1: Check if the user is registered
async function checkUserRegistration() {
    try {
        console.log('Checking if user is registered...');

        const query = new ContractCallQuery()
            .setContractId(user_registry_address)
            .setGas(100000)
            .setFunction("isRegistered", new ContractFunctionParameters().addAddress(accountId.toSolidityAddress()));

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
        throw error;
    }
}

// Function to register a product
async function registerProduct(name, description, price, initialSupply) {
    try {
        console.log('Registering product:', name);
        console.log('Description:', description);
        console.log('Price:', price);
        console.log('Initial Supply:', initialSupply);

        const transaction = await new ContractExecuteTransaction()
            .setContractId(product_marketplace_address)
            .setFunction('registerProduct', new ContractFunctionParameters()
                .addString(name)
                .addString(description)
                .addUint256(price)
                .addUint256(initialSupply)
            )
            .setGas(1000000)
            .execute(client);

        console.log('Transaction ID:', transaction.transactionId.toString());

        // Wait for the receipt to confirm the transaction
        const receipt = await transaction.getReceipt(client);
        console.log(`Product registration status: ${receipt.status}`);

        return receipt.status.toString() === 'SUCCESS';
    } catch (error) {
        console.error('Error registering product:', error);
        throw error;
    }
}

// Function to add more supply to an existing product
async function addProductSupply(productId, amount) {
    try {
        console.log(`Adding ${amount} units to product ID ${productId}`);

        const transaction = await new ContractExecuteTransaction()
            .setContractId(product_marketplace_address)
            .setFunction('addProductSupply', new ContractFunctionParameters()
                .addUint256(productId)
                .addUint256(amount)
            )
            .setGas(500000)
            .execute(client);

        console.log('Transaction ID:', transaction.transactionId.toString());

        // Wait for the receipt to confirm the transaction
        const receipt = await transaction.getReceipt(client);
        console.log(`Supply addition status: ${receipt.status}`);

        return receipt.status.toString() === 'SUCCESS';
    } catch (error) {
        console.error('Error adding product supply:', error);
        throw error;
    }
}

// Function to buy a product
async function buyProduct(productId, price) {
    try {
        console.log(`Buying product ID ${productId} for ${price} HBAR`);

        const transaction = await new ContractExecuteTransaction()
            .setContractId(product_marketplace_address)
            .setFunction('buyProduct', new ContractFunctionParameters()
                .addUint256(productId)
            )
            .setPayableAmount(new Hbar(price))
            .setGas(700000)
            .execute(client);

        console.log('Transaction ID:', transaction.transactionId.toString());

        // Wait for the receipt to confirm the transaction
        const receipt = await transaction.getReceipt(client);
        console.log(`Purchase status: ${receipt.status}`);

        return receipt.status.toString() === 'SUCCESS';
    } catch (error) {
        console.error('Error buying product:', error);
        throw error;
    }
}

// Function to leave a review for a product
async function leaveReview(productId, reviewText) {
    try {
        console.log(`Leaving review for product ID ${productId}`);

        const transaction = await new ContractExecuteTransaction()
            .setContractId(product_marketplace_address)
            .setFunction('leaveReview', new ContractFunctionParameters()
                .addUint256(productId)
                .addString(reviewText)
            )
            .setGas(500000)
            .execute(client);

        console.log('Transaction ID:', transaction.transactionId.toString());

        // Wait for the receipt to confirm the transaction
        const receipt = await transaction.getReceipt(client);
        console.log(`Review submission status: ${receipt.status}`);

        return receipt.status.toString() === 'SUCCESS';
    } catch (error) {
        console.error('Error leaving review:', error);
        throw error;
    }
}

// Function to get product details
async function getProductDetails(productId) {
    try {
        console.log(`Getting details for product ID ${productId}`);

        const query = new ContractCallQuery()
            .setContractId(product_marketplace_address)
            .setGas(100000)
            .setFunction("products", new ContractFunctionParameters().addUint256(productId));

        const result = await query.execute(client);

        // Parse the product details from the result
        const name = result.getString(0);
        const description = result.getString(1);
        const price = result.getUint256(2);
        const supply = result.getUint256(3);
        const creator = "0x" + result.getAddress(4);
        const exists = result.getBool(5);

        console.log({
            name,
            description,
            price: price.toString(),
            supply: supply.toString(),
            creator,
            exists
        });

        return {
            name,
            description,
            price,
            supply,
            creator,
            exists
        };
    } catch (error) {
        console.error('Error getting product details:', error);
        throw error;
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

        // Register a new product
        const productName = "Smart Watch Pro";
        const description = "Premium smartwatch with heart rate monitor and GPS";
        const price = 300000000; // 3 HBAR in tinybars (assuming price in tinybars)
        const initialSupply = 50;

        const registerSuccess = await registerProduct(productName, description, price, initialSupply);

        if (registerSuccess) {
            console.log("Product registered successfully!");

            // Get the product ID (assuming it's the last product created)
            const productId = await getLastProductId();

            // Add more supply
            await addProductSupply(productId, 25);

            // Buy the product
            await buyProduct(productId, 3); // 3 HBAR

            // Leave a review
            await leaveReview(productId, "Great product, exactly as described!");

            // Get updated product details
            await getProductDetails(productId);
        }

    } catch (error) {
        console.error('Operation failed:', error);
    }
}

// Helper function to get the last product ID
async function getLastProductId() {
    try {
        const query = new ContractCallQuery()
            .setContractId(product_marketplace_address)
            .setGas(100000)
            .setFunction("totalProducts");

        const result = await query.execute(client);
        const totalProducts = result.getUint256();

        // Product IDs are zero-indexed, so last ID is totalProducts - 1
        return totalProducts.toNumber() > 0 ? totalProducts.toNumber() - 1 : 0;
    } catch (error) {
        console.error('Error getting last product ID:', error);
        throw error;
    }
}

// Execute the main function
main();