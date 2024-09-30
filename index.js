const { showMenu } = require('./menu');
const { login } = require('./login');

async function main() {
    console.log("Welcome to the Hedera Application!");

    // Step 1: User Login
    const credentials = await login();
    
    // Step 2: Show the menu and pass credentials
    showMenu(credentials);
}

main();