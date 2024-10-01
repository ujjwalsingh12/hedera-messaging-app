// const { json } = require("express");
// import displayBalance from "./display_balance";
const socket = io();

const inputElement = document.getElementById('input');
const outputElement = document.getElementById('output');
const user = document.getElementById('user');

// Listen for 'Enter' key press to send command
inputElement.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        const command = inputElement.value;
        socket.emit('command', command); // Send command to server
        inputElement.value = ''; // Clear the input field
    }
});

// Listen for output from server
// Listen for 'output' event to display normal messages
socket.on('output', (data) => {
    console.log(data);
    outputElement.innerHTML += data + '\n'; // Append new output
    // outputElement.innerHTML += data + '\n';
    outputElement.scrollTop = outputElement.scrollHeight; // Auto scroll to the bottom
});

// Listen for 'clear' event to clear the screen
socket.on('clear', () => {
    console.log('Clear event received');
    outputElement.innerHTML = ''; // Clear the output display
});

socket.on('login', (data) => {
    console.log('hi');
    user.innerHTML = "Current User: " + data.slice(-11);
    outputElement.innerHTML += data + '\n'; // Append new output
    // outputElement.innerHTML += data + '\n';
    outputElement.scrollTop = outputElement.scrollHeight; // Auto scroll to the bottom
});

socket.on('logout', (data) => {
    outputElement.innerHTML += "Logging out" + '\n'; // Append new output
    user.innerHTML = "";
    console.log('logout');
    outputElement.innerHTML = ""; // Append new output
    // outputElement.innerHTML += data + '\n';
    outputElement.scrollTop = outputElement.scrollHeight; // Auto scroll to the bottom
});



socket.on('balance', (data) => {
    // Check if the data is a balance object
    displayBalance(data);
    outputElement.scrollTop = outputElement.scrollHeight; // Auto scroll to the bottom
});

socket.on('balanceall', (data) => {
    // Check if the data is a balance object
    displayBalanceall(data);
    outputElement.scrollTop = outputElement.scrollHeight; // Auto scroll to the bottom
});

socket.on('products', (data) => {
    // Check if the data is a balance object
    displayProducts(data);
    outputElement.scrollTop = outputElement.scrollHeight; // Auto scroll to the bottom
});

//----------------------------------------------------------------------------------------------------------

function displayBalanceall(data) {
    const balances = JSON.parse(data);
    console.log(balances);
    const outputDiv = document.getElementById('output');
    outputDiv.innerHTML = ''; // Clear previous output

    // Create a table
    const table = document.createElement('table');
    const headerRow = document.createElement('tr');

    // Create headers
    const headers = ['Account ID', 'Hbars', 'Token ID', 'Token Amount', 'Decimals'];
    headers.forEach(headerText => {
        const header = document.createElement('th');
        header.textContent = headerText;
        headerRow.appendChild(header);
    });
    table.appendChild(headerRow);

    // Loop through each account in the balances object
    for (const accountId in balances) {
        const accountData = balances[accountId];
        
        // Add the hbars row
        const hbarsRow = document.createElement('tr');
        hbarsRow.innerHTML = `<td>${accountId}</td><td>${accountData.hbars}</td><td>-</td><td>-</td><td>-</td>`;
        table.appendChild(hbarsRow);

        // Parse token balances and token decimals
        const tokens = JSON.parse(accountData.tokens);
        const tokenDecimals = JSON.parse(accountData.tokenDecimals);

        // Add rows for each token
        for (const tokenId in tokens) {
            const tokenRow = document.createElement('tr');
            const tokenAmount = tokens[tokenId];
            const tokenDecimal = tokenDecimals[tokenId] || 0;

            tokenRow.innerHTML = `<td>${accountId}</td><td></td><td>${tokenId}</td><td>${tokenAmount.low}.${tokenAmount.high}</td><td>${tokenDecimal}</td>`;
            table.appendChild(tokenRow);
        }

        // If no tokens, add an empty row for tokens
        if (Object.keys(tokens).length === 0) {
            const emptyTokenRow = document.createElement('tr');
            emptyTokenRow.innerHTML = `<td>${accountId}</td><td></td><td>No Tokens</td><td>-</td><td>-</td>`;
            table.appendChild(emptyTokenRow);
        }
    }

    // Append the table to the output div
    outputDiv.appendChild(table);
}


function displayBalance(data) {
    // Parse the incoming balance data
    const balance = JSON.parse(data);
    console.log(balance);
    
    const outputDiv = document.getElementById('output');
    outputDiv.innerHTML = ''; // Clear previous output

    // Create a table
    const table = document.createElement('table');
    const headerRow = document.createElement('tr');

    // Create headers
    const headers = ['Description', 'Value'];
    headers.forEach(headerText => {
        const header = document.createElement('th');
        header.textContent = headerText;
        headerRow.appendChild(header);
    });
    table.appendChild(headerRow);

    // Add balance hbars
    const hbarsRow = document.createElement('tr');
    hbarsRow.innerHTML = `<td>Hbars</td><td>${balance.hbars}</td>`;
    table.appendChild(hbarsRow);

    // Parse tokens and tokenDecimals from the string format
    const tokens = JSON.parse(balance.tokens);
    const tokenDecimals = JSON.parse(balance.tokenDecimals);

    // Add token balances
    for (const tokenId in tokens) {
        const tokenRow = document.createElement('tr');
        const tokenAmount = tokens[tokenId];
        const tokenDecimal = tokenDecimals[tokenId] || 0;

        // Display token details with the low/high values and decimals
        tokenRow.innerHTML = `<td>Token ID: ${tokenId} (Decimals: ${tokenDecimal})</td><td>${tokenAmount.low}.${tokenAmount.high}</td>`;
        table.appendChild(tokenRow);
    }

    // Append the table to the output div
    outputDiv.appendChild(table);
}

function displayProducts(data) {
    // Parse the incoming data (assuming it is a JSON string)
    const products = JSON.parse(data);
    console.log(products);

    const outputDiv = document.getElementById('output');
    outputDiv.innerHTML = ''; // Clear previous output

    // Create a table
    const table = document.createElement('table');
    const headerRow = document.createElement('tr');

    // Create headers
    const headers = ['Topic ID', 'Metadata'];
    headers.forEach(headerText => {
        const header = document.createElement('th');
        header.textContent = headerText;
        headerRow.appendChild(header);
    });
    table.appendChild(headerRow);

    // Add product data to the table
    products.forEach(product => {
        const productRow = document.createElement('tr');
        productRow.innerHTML = `<td>${product.topicId}</td><td>${product.metadata}</td>`;
        table.appendChild(productRow);
    });

    // Append the table to the output div
    outputDiv.appendChild(table);
}