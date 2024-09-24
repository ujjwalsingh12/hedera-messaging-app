const { Client, PrivateKey, TokenCreateTransaction, TokenType, TokenSupplyType, Hbar, AccountId } = require("@hashgraph/sdk");

// Your Hedera account ID and private key
require("dotenv").config();

// Initialize Hedera client
const client = Client.forTestnet(); // Use Client.forMainnet() for mainnet
client.setOperator(process.env["HEDERA_ACCOUNT_ID"], process.env["HEDERA_PRIVATE_KEY2]);

async function createToken() {
    // Define the token creation transaction
    const tokenCreateTx = new TokenCreateTransaction()
        .setTokenName("My Token")
        .setTokenSymbol("MTK")
        .setTokenType(TokenType.FungibleCommon) // Choose TokenType.FungibleCommon or TokenType.NonFungibleUnique
        .setSupplyType(TokenSupplyType.Infinite) // Choose TokenSupplyType.Infinite or TokenSupplyType.Finite
        .setInitialSupply(10) // Set initial supply if supply type is finite
        .setTreasuryAccountId(process.env["HEDERA_ACCOUNT_ID"]) // The account that will hold the token
        .setAdminKey(client.publicKey) // Admin key to manage the token
        .setMaxTransactionFee(new Hbar(18)); // Set the max transaction fee


        // const estimatedFee = await tokenCreateTx.getCost(client);
        // console.log(`Estimated Fee: ${estimatedFee.toTinybars() / 1e8} HBAR`);
    
    // Sign the transaction
    const txResponse = await tokenCreateTx.execute(client);

    // Get the receipt of the transaction
    const receipt = await txResponse.getReceipt(client);

    // Get the token ID
    const tokenId = receipt.tokenId;
    console.log(`Token created with ID: ${tokenId.toString()}`);
}

createToken().catch(console.error);

// module.exports = { createToken};