const { Client, AccountId, Hbar, AccountBalanceQuery } = require("@hashgraph/sdk");
const { printJson}  = require('./printJson')
const { check_balance } = require('./check_balance');
require("dotenv").config();
const accounts = require('./keys.json');


async function check_balance_all() {
    let g = {};
    for (const [index, account] of accounts.entries()) {
        g[account.account_id] = await check_balance(account.account_id, account.private_key);
    }
    return g;
}

module.exports = {check_balance_all};

async function xx(params) {
    console.log(await check_balance_all());
}

xx();