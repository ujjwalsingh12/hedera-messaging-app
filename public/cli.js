/**
 * This JavaScript code is designed to provide a web-based Command Line Interface (CLI) 
 * for interacting with a backend server. It uses Socket.IO to establish real-time 
 * communication between the browser and the server. Users can input commands in the 
 * browser, which are sent to the server for processing. The server responds with 
 * various events (e.g., `output`, `clear`, `login`, `logout`, etc.), and the frontend 
 * dynamically updates the UI based on these events. The code also includes functions 
 * to display account balances, products, and messages in a structured table format.
 */

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
    outputElement.scrollTop = outputElement.scrollHeight; // Auto scroll to the bottom
});

socket.on('logout', (data) => {
    outputElement.innerHTML += "Logging out" + '\n'; // Append new output
    user.innerHTML = "";
    console.log('logout');
    outputElement.innerHTML = ""; // Append new output
    outputElement.scrollTop = outputElement.scrollHeight; // Auto scroll to the bottom
});

socket.on('balance', (data) => {
    displayBalance(data);
    outputElement.scrollTop = outputElement.scrollHeight; // Auto scroll to the bottom
});

socket.on('balanceall', (data) => {
    displayBalanceall(data);
    outputElement.scrollTop = outputElement.scrollHeight; // Auto scroll to the bottom
});

socket.on('products', (data) => {
    displayProducts(data);
    outputElement.scrollTop = outputElement.scrollHeight; // Auto scroll to the bottom
});

socket.on('messages', (data) => {
    displayMessages(data);
    outputElement.scrollTop = outputElement.scrollHeight; // Auto scroll to the bottom
});

//----------------------------------------------------------------------------------------------------------

function displayBalanceall(data) {
    const balances = JSON.parse(data);
    console.log(balances);
    const outputDiv = document.getElementById('output');
    outputDiv.innerHTML = ''; // Clear previous output

    const table = document.createElement('table');
    const headerRow = document.createElement('tr');
    const headers = ['Account ID', 'Hbars', 'Token ID', 'Token Amount', 'Decimals'];
    headers.forEach(headerText => {
        const header = document.createElement('th');
        header.textContent = headerText;
        headerRow.appendChild(header);
    });
    table.appendChild(headerRow);

    for (const accountId in balances) {
        const accountData = balances[accountId];
        const hbarsRow = document.createElement('tr');
        hbarsRow.innerHTML = `<td>${accountId}</td><td>${accountData.hbars}</td><td>-</td><td>-</td><td>-</td>`;
        table.appendChild(hbarsRow);

        const tokens = JSON.parse(accountData.tokens);
        const tokenDecimals = JSON.parse(accountData.tokenDecimals);

        for (const tokenId in tokens) {
            const tokenRow = document.createElement('tr');
            const tokenAmount = tokens[tokenId];
            const tokenDecimal = tokenDecimals[tokenId] || 0;

            tokenRow.innerHTML = `<td>${accountId}</td><td></td><td>${tokenId}</td><td>${tokenAmount.low}.${tokenAmount.high}</td><td>${tokenDecimal}</td>`;
            table.appendChild(tokenRow);
        }

        if (Object.keys(tokens).length === 0) {
            const emptyTokenRow = document.createElement('tr');
            emptyTokenRow.innerHTML = `<td>${accountId}</td><td></td><td>No Tokens</td><td>-</td><td>-</td>`;
            table.appendChild(emptyTokenRow);
        }
    }

    outputDiv.appendChild(table);
}

function displayBalance(data) {
    const balance = JSON.parse(data);
    console.log(balance);

    const outputDiv = document.getElementById('output');
    outputDiv.innerHTML = ''; // Clear previous output

    const table = document.createElement('table');
    const headerRow = document.createElement('tr');
    const headers = ['Description', 'Value'];
    headers.forEach(headerText => {
        const header = document.createElement('th');
        header.textContent = headerText;
        headerRow.appendChild(header);
    });
    table.appendChild(headerRow);

    const hbarsRow = document.createElement('tr');
    hbarsRow.innerHTML = `<td>Hbars</td><td>${balance.hbars}</td>`;
    table.appendChild(hbarsRow);

    const tokens = JSON.parse(balance.tokens);
    const tokenDecimals = JSON.parse(balance.tokenDecimals);

    for (const tokenId in tokens) {
        const tokenRow = document.createElement('tr');
        const tokenAmount = tokens[tokenId];
        const tokenDecimal = tokenDecimals[tokenId] || 0;

        tokenRow.innerHTML = `<td>Token ID: ${tokenId} (Decimals: ${tokenDecimal})</td><td>${tokenAmount.low}.${tokenAmount.high}</td>`;
        table.appendChild(tokenRow);
    }

    outputDiv.appendChild(table);
}

function displayProducts(data) {
    const products = JSON.parse(data);
    console.log(products);

    const outputDiv = document.getElementById('output');
    outputDiv.innerHTML = ''; // Clear previous output

    const table = document.createElement('table');
    const headerRow = document.createElement('tr');
    const headers = ['Topic ID', 'Products'];
    headers.forEach(headerText => {
        const header = document.createElement('th');
        header.textContent = headerText;
        headerRow.appendChild(header);
    });
    table.appendChild(headerRow);

    products.forEach(product => {
        const productRow = document.createElement('tr');
        productRow.innerHTML = `<td>${product.topicId}</td><td>${product.metadata}</td>`;
        table.appendChild(productRow);
    });

    outputDiv.appendChild(table);
}

function displayMessages(datas) {
    const data = JSON.parse(datas);
    const testDataArray = data.map(item => JSON.parse(item));
    console.log(testDataArray);

    const outputDiv = document.getElementById('output');
    outputDiv.innerHTML = ''; // Clear previous output

    const table = document.createElement('table');
    const headerRow = document.createElement('tr');
    const headers = ['Message', 'Signature'];
    headers.forEach(headerText => {
        const header = document.createElement('th');
        header.textContent = headerText;
        headerRow.appendChild(header);
    });
    table.appendChild(headerRow);

    testDataArray.forEach(item => {
        const dataRow = document.createElement('tr');
        dataRow.innerHTML = `<td>${item.testdata}</td><td>${item.signature}</td>`;
        table.appendChild(dataRow);
    });

    outputDiv.appendChild(table);
}
