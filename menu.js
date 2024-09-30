const readline = require('readline');
const { create_product } = require('./create_product');
const { check_balance } = require('./check_balance');
const { check_balance_all } = require('./check_balance_all');
const { create_token } = require('./create_token.ts');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

// Menu options
const menuOptions = {
    1: 'Create Product',
    2: 'Check Balance',
    3: 'Check Balance for All Accounts',
    4: 'Create Token',
    5: 'Exit'
};

// Function to display the menu
function displayMenu() {
    console.log('\nPlease choose an option:');
    Object.keys(menuOptions).forEach(option => {
        console.log(`${option}: ${menuOptions[option]}`);
    });
}

// Function to handle user input and call corresponding function
async function handleInput(choice, credentials) {
    switch (choice) {
        case '1': // Create Product
            rl.question('Enter Central Topic: ', async (centralTopic) => {
                rl.question('Enter Product Name: ', async (productName) => {
                    await create_product(centralTopic, credentials.account_id, productName);
                    promptUser(credentials);
                });
            });
            break;

        case '2': // Check Balance for a Specific Account
            const balance = await check_balance(credentials.account_id, credentials.private_key);
            console.log(`Balance: ${balance}`);
            promptUser(credentials);
            break;

        case '3': // Check Balance for All Accounts
            const balances = await check_balance_all();
            console.log(balances);
            promptUser(credentials);
            break;

        case '4': // Create Token
            rl.question('Enter Token Name: ', async (tokenName) => {
                rl.question('Enter Treasury Account ID: ', async (tresuryId) => {
                    rl.question('Enter Hbar Fee: ', async (hbar) => {
                        await create_token(credentials.account_id, tokenName, tresuryId, hbar);
                        promptUser(credentials);
                    });
                });
            });
            break;

        case '5': // Exit
            console.log('Exiting...');
            rl.close();
            break;

        default:
            console.log('Invalid choice. Please try again.');
            promptUser(credentials);
            break;
    }
}

// Function to prompt user for input
function promptUser(credentials) {
    displayMenu();
    rl.question('Enter your choice: ', (choice) => {
        handleInput(choice, credentials);
    });
}

// Show the menu and pass credentials
function showMenu(credentials) {
    promptUser(credentials);
}

module.exports = { showMenu };