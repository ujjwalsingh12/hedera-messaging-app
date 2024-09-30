const express = require('express');
const http = require('http');
const socketIO = require('socket.io');

// Import your functions
const { create_product } = require('./create_product');
const { check_balance } = require('./check_balance');
const { check_balance_all } = require('./check_balance_all');
const { create_token } = require('./create_token.ts');
const fs = require('fs');

// Read keys from keys.json
const app = express();
const server = http.createServer(app);
const io = socketIO(server);

// Serve static files
app.use(express.static('public'));

const keys = JSON.parse(fs.readFileSync('keys.json', 'utf8'));
let credentials = {};
let tresury = 4;
let tresury_credentials = {"account_id":keys[tresury].account_id};
const centralTopic = "0.0.4893302";
let accountSN = 0;

// Helper function to format JSON into a table-like structure
function formatJSONForTable(data) {
    return JSON.stringify(data, null, 4); // Indent with 4 spaces for better readability
}

// Handle socket connection
io.on('connection', (socket) => {
    console.log('Client connected');

    // Listen for commands from the frontend
    socket.on('command', async (data) => {
        const [command, ...args] = data.split(' ');

        try {
            switch (command) {
                case 'login':
                    const accountSerial = parseInt(args[0], 10); // Convert the argument to an integer
                    if (!keys[accountSerial]) {
                        socket.emit('login', `Invalid account number: ${accountSerial}`);
                        break;
                    }
                
                    // Fetch the account ID and private key from keys.json
                    accountSN = accountSerial;
                    credentials.account_id = keys[accountSerial].account_id;
                    credentials.private_key = keys[accountSerial].private_key;
                
                    socket.emit('login', `Logged in with account ID: ${credentials.account_id}`);
                    break;

                case 'logout':
                    socket.emit('logout');
                    break;

                case 'create_product':
                    const topic = await create_product(centralTopic, accountSN, args[1]);
                    socket.emit('output', `Product created with topic: ${topic}`);
                    break;

                case 'check_balance':
                    const balance = await check_balance(credentials.account_id, credentials.private_key);
                    socket.emit('balance', `${formatJSONForTable(balance)}`);
                    break;

                case 'check_balance_all':
                    const allBalances = await check_balance_all();
                    socket.emit('balanceall', `${formatJSONForTable(allBalances)}`);
                    break;

                case 'create_token':
                    const tokenId = await create_token(credentials.account_id, args[0], credentials.account_id, args[1]);
                    socket.emit('output', `Token created with ID: ${tokenId}`);
                    break;
                
                    

                case 'help':
                    socket.emit('output', 
                        ```
                        Available commands: 
                        login <serial num>, 
                        create_product <product name>, 
                        check_balance, 
                        check_balance_all, 
                        create_token <name> <hbar>, 
                        clear```);
                    break;
                
                case 'clear':
                    // console.clear(); // Clear the server-side console
                    socket.emit('clear'); // Tell the client to clear the screen
                    break;

                default:
                    socket.emit('output', 'Invalid command. Type "help" for a list of commands.');
                    break;
            }
        } catch (error) {
            socket.emit('output', `Error executing command: ${error.message}`);
        }
    });

    socket.on('disconnect', () => {
        console.log('Client disconnected');
    });
});

// Start the server
const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});