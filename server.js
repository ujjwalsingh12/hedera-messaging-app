const express = require('express');
const http = require('http');
const socketIO = require('socket.io');

// Import your functions
const { create_product } = require('./create_product');
const { check_balance } = require('./check_balance');
const { check_balance_all } = require('./check_balance_all');
const { create_token } = require('./create_token.ts');

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

// Serve static files
app.use(express.static('public'));

let credentials = {};

// Handle socket connection
io.on('connection', (socket) => {
    console.log('Client connected');

    // Listen for commands from the frontend
    socket.on('command', async (data) => {
        const [command, ...args] = data.split(' ');

        switch (command) {
            case 'login':
                credentials.account_id = args[0];
                credentials.private_key = args[1];
                socket.emit('output', `Logged in with account ID: ${credentials.account_id}`);
                break;

            case 'create_product':
                const topic = await create_product(args[0], credentials.account_id, args[1]);
                socket.emit('output', `Product created with topic: ${topic}`);
                break;

            case 'check_balance':
                const balance = await check_balance(credentials.account_id, credentials.private_key);
                socket.emit('output', `Balance: ${balance}`);
                break;

            case 'check_balance_all':
                const allBalances = await check_balance_all();
                socket.emit('output', `All balances: ${JSON.stringify(allBalances)}`);
                break;

            case 'create_token':
                const tokenId = await create_token(credentials.account_id, args[0], args[1], args[2]);
                socket.emit('output', `Token created with ID: ${tokenId}`);
                break;

            case 'help':
                socket.emit('output', 'Available commands: login, create_product, check_balance, check_balance_all, create_token');
                break;

            default:
                socket.emit('output', 'Invalid command. Type "help" for a list of commands.');
                break;
        }
    });

    socket.on('disconnect', () => {
        console.log('Client disconnected');
    });
});

// Start the server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});