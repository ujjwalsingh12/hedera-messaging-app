const { Client, AccountId, Hbar, AccountBalanceQuery } = require("@hashgraph/sdk");
const { printJson}  = require('./printJson')
require("dotenv").config();
// async function getAccountBalance(accountId) {
//     // Create a client
//     const client = Client.forTestnet(); // Use Client.forMainnet() for the main network
//     client.setOperator(process.env.HEDERA_ACCOUNT_ID, process.env.HEDERA_PRIVATE_KEY);  // Set your account ID and private key

//     // Fetch the account balance
// }

// Replace with the account ID you want to check
// const client = Client.forTestnet().setOperator(process.env.HEDERA_ACCOUNT_ID2, process.env.HEDERA_PRIVATE_KEY2);
// const accountId = process.env.HEDERA_ACCOUNT_ID2; // Example account ID
async function checkbal(client,accountId){
    var balanceCheckTx = await new AccountBalanceQuery().setAccountId(accountId).execute(client);
    // const balance = await client.getAccountBalance(AccountId.fromString(accountId));
    // console.log(`Balance of account ${accountId}: ${balanceCheckTx.toString()} Hbar`);
    Object.entries(balanceCheckTx).forEach(([key,value])=>{
        console.log(`${key}:${value}`);
        
    });
    // console.log(balanceCheckTx.tokens._map.keys);
    // console.log(`Alice's balance: ${balanceCheckTx.tokens._map.get(tokenId.toString())} NFTs of ID ${tokenId}`);
}
async function fun(ac_id,priv_key){
    const client = Client.forTestnet().setOperator(ac_id,priv_key);
    const accountId = ac_id; // Example account ID
    await checkbal(client,accountId);
}
const accounts = require('./keys.json');
async function print() {
    for (const [index, account] of accounts.entries()) {
        console.log(`----------------- Account (${account.account_id}) --------------------------------------------`);
        await fun(account.account_id, account.private_key);
    }
}
print();