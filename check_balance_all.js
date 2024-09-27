const { Client, AccountId, Hbar, AccountBalanceQuery } = require("@hashgraph/sdk");
const { printJson}  = require('./printJson')
require("dotenv").config();
const accounts = require('./keys.json');

async function checkbal(client,accountId){
    var balanceCheckTx = await new AccountBalanceQuery().setAccountId(accountId).execute(client);
    Object.entries(balanceCheckTx).forEach(([key,value])=>{
        console.log(`${key}:${value}`);
        
    });
}

async function fun(ac_id,priv_key){
    const client = Client.forTestnet().setOperator(ac_id,priv_key);
    const accountId = ac_id; // Example account ID
    await checkbal(client,accountId);
}


async function check_balance_all() {
    for (const [index, account] of accounts.entries()) {
        console.log(`----------------- Account (${account.account_id}) --------------------------------------------`);
        await fun(account.account_id, account.private_key);
    }
}

module.exports = {check_balance_all};