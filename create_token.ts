const { Client, PrivateKey, TokenCreateTransaction, TokenType, TokenSupplyType, Hbar, AccountId } = require("@hashgraph/sdk");

// Your Hedera account ID and private key
require("dotenv").config();
const account = require('./keys.json');


// Initialize Hedera client
const client = Client.forTestnet(); // Use Client.forMainnet() for mainnet

async function create_token(account_num,token_name,tresury_id,hbar) {
    client.setOperator(account[account_num].account_id, account[account_num].private_key);
    // Define the token creation transaction
    const tokenCreateTx = new TokenCreateTransaction()
        .setTokenName(token_name)
        .setTokenSymbol("REW")
        .setTokenType(TokenType.FungibleCommon) // Choose TokenType.FungibleCommon or TokenType.NonFungibleUnique
        .setSupplyType(TokenSupplyType.Infinite) // Choose TokenSupplyType.Infinite or TokenSupplyType.Finite
        .setInitialSupply(10) // Set initial supply if supply type is finite
        .setTreasuryAccountId(tresury_id) // The account that will hold the token
        .setAdminKey(client.publicKey) // Admin key to manage the token
        .setMaxTransactionFee(new Hbar(hbar)); // Set the max transaction fee


        // const estimatedFee = await tokenCreateTx.getCost(client);
        // console.log(`Estimated Fee: ${estimatedFee.toTinybars() / 1e8} HBAR`);
    
    // Sign the transaction
    const txResponse = await tokenCreateTx.execute(client);

    // Get the receipt of the transaction
    const receipt = await txResponse.getReceipt(client);

    // Get the token ID
    const tokenId = receipt.tokenId;
    console.log(`Token created with ID: ${tokenId.toString()}`);
    return tokenId;
}

// createToken(0,).catch(console.error);

module.exports = {create_token};