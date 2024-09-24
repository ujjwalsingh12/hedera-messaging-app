// const accounts = require('./keys.json');
// console.log('Loaded JSON data:', accounts);
// console.log(accounts[0].account_id);

const accounts = require('./keys.json');
accounts.forEach((account,index)=>{
    console.log(`Account (${index}):=====================================||`);
    Object.entries(account).forEach(([key,value])=>{
        console.log(`${key}:${value}`);
    }
)
});