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