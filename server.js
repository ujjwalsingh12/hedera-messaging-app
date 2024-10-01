const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const fs = require('fs');

// Import your functions
const { create_product } = require('./create_product');
const { check_balance } = require('./check_balance');
const { check_balance_all } = require('./check_balance_all');
const { create_token } = require('./create_token');
const { fetch_messages } = require('./fetch_messages'); // Import the new module
const { fetch_topic_metadata } = require('./fetch_topic_metadata'); // Import the new module
const { send_message } = require('./send_message');

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

// Serve static files
app.use(express.static('public'));

const keys = JSON.parse(fs.readFileSync('keys.json', 'utf8'));
let credentials = {};
let treasury = 4;
let treasury_credentials = { "account_id": keys[treasury].account_id };
const centralTopic = "0.0.4893302";
const producttopic = "0.0.4893302";

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
                    const accountSerial = parseInt(args[0], 10);
                    if (!keys[accountSerial]) {
                        socket.emit('login', `Invalid account number: ${accountSerial}`);
                        break;
                    }
                
                    accountSN = accountSerial;
                    credentials.account_id = keys[accountSerial].account_id;
                    credentials.private_key = keys[accountSerial].private_key;

                    socket.emit('login', `Logged in with account ID: ${credentials.account_id}`);
                    break;

                case 'logout':
                    socket.emit('logout');
                    break;

                case 'send_message':
                    const topicToSend = args[0];
                    const messageContent = args.slice(1).join(' '); // Get message and topic from args
                    const response = await send_message(messageContent, accountSN, topicToSend);
                    socket.emit('output', response);
                    break;

                case 'create_product':
                    const topic = await create_product(centralTopic, accountSN, args.slice(1).join(' '));
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

                case 'fetch_products':
                    const topicId = centralTopic; // Get the topicId from the arguments
                    // const messagesList = await fetch_messages(accountSN,topicId); // Call the fetch_messages function
                    await fetch_messages(accountSN,topicId, 10000).then((messages) => {
                        
                        get_metadata(accountSN,messages).then((names)=>{
                            socket.emit('products',names);
                        });
                        
                        // console.log(names);
                        // socket.emit('output', names); // Send messages back to the client
                    }).catch((error) => {
                        socket.emit('output', error); // Send messages back to the client
                        // console.error("Error fetching messages:", error);
                    });
                    break;

                    case 'fetch_messages':
                        const topicId2 = args[0]; // Get the topicId from the arguments
                        await fetch_messages(accountSN,topicId2, 10000).then((messages) => {
                            socket.emit('messages', messages); // Send messages back to the client
                        }).catch((error) => {
                            socket.emit('output', error); // Send messages back to the client
                        });
                        break;


                case 'help':
                    socket.emit('output', 
                        `Available commands: 
                        login <serial num>, 
                        create_product <product name>, 
                        check_balance,
                        send_message <topicId> <message>,  
                        check_balance_all, 
                        create_token <name> <hbar>, 
                        fetch_products, 
                        fetch_messages <topicId>, 
                        clear`);
                    break;

                case 'clear':
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



async function get_metadata(account_num,topic_idss) {
    let metadataList = [];
    const topic_ids = JSON.parse(topic_idss);
    for (const topicId of topic_ids) {
        try {
            const metadata = await fetch_topic_metadata(account_num, topicId);
            metadataList.push({ topicId, metadata });
        } catch (error) {
            console.error(`Error fetching metadata for topic ${topicId}: ${error.message}`);
            metadataList.push({ topicId, error: error.message });
        }
    }

    return JSON.stringify(metadataList);
}