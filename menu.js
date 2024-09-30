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
    4: 'Create Token'
};

// Function to display the menu
function displayMenu() {
    console.log('\nPlease choose an option:');
    Object.keys(menuOptions).forEach(option => {
        console.log(`${option}: ${menuOptions[option]}`);
    });
    console.log('5: Exit');
}

// Function to handle user input and execute the corresponding function
async function handleInput(choice) {
    switch (choice) {
        case '1': // Create Product
            rl.question('Enter Central Topic: ', async (centralTopic) => {
                rl.question('Enter Account Number: ', async (accountNum) => {
                    rl.question('Enter Product Name: ', async (productName) => {
                        await create_product(centralTopic, accountNum, productName);
                        promptUser();
                    });
                });
            });
            break;

        case '2': // Check Balance for a Specific Account
            rl.question('Enter Account ID: ', async (acId) => {
                rl.question('Enter Private Key: ', async (privKey) => {
                    const balance = await check_balance(acId, privKey);
                    console.log(`Balance: ${balance}`);
                    promptUser();
                });
            });
            break;

        case '3': // Check Balance for All Accounts
            const balances = await check_balance_all();
            console.log(balances);
            promptUser();
            break;

        case '4': // Create Token
            rl.question('Enter Account Number: ', async (accountNum) => {
                rl.question('Enter Token Name: ', async (tokenName) => {
                    rl.question('Enter Treasury Account ID: ', async (tresuryId) => {
                        rl.question('Enter Hbar Fee: ', async (hbar) => {
                            await create_token(accountNum, tokenName, tresuryId, hbar);
                            promptUser();
                        });
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
            promptUser();
            break;
    }
}

// Function to prompt user input
function promptUser() {
    displayMenu();
    rl.question('Enter your choice: ', (choice) => {
        handleInput(choice);
    });
}

// Start the program
promptUser();