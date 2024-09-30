const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    terminal: true
});

// Function to log in and store credentials
async function login() {
    return new Promise((resolve) => {
        rl.question('Enter your Account ID: ', (accountId) => {
            rl.question('Enter your Private Key: ', (privateKey) => {
                const credentials = { account_id: accountId, private_key: privateKey };
                console.log('Logged in successfully!\n');
                resolve(credentials);
                rl.prompt();
            });
        });
    });
}

module.exports = { login };