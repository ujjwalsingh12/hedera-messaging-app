const { Client, AccountId, Hbar, AccountBalanceQuery } = require("@hashgraph/sdk");
const { printJson}  = require('./printJson')
require("dotenv").config();
const accounts = require('./keys.json');

async function checkbalreq(client,accountId){
    var balanceCheckTx = await new AccountBalanceQuery().setAccountId(accountId).execute(client);
    let resp = {}
    Object.entries(balanceCheckTx).forEach(([key,value])=>{
        resp[key.toString()]= value.toString();
        
    });
    return resp;
}

async function check_balance(ac_id,priv_key){
    const client = Client.forTestnet().setOperator(ac_id,priv_key);
    const accountId = ac_id; // Example account ID
    let val = await checkbalreq(client,accountId);
    return val;
}

module.exports = {check_balance};

// async function xx(params) {
//     console.log(await check_balance_all());
// }

// xx();