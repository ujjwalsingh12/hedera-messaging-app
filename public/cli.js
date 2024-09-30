const socket = io();

const inputElement = document.getElementById('input');
const outputElement = document.getElementById('output');

// Listen for 'Enter' key press to send command
inputElement.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        const command = inputElement.value;
        socket.emit('command', command); // Send command to server
        inputElement.value = ''; // Clear the input field
    }
});

// Listen for output from server
socket.on('output', (data) => {
    outputElement.innerHTML += data + '\n'; // Append new output
    outputElement.scrollTop = outputElement.scrollHeight; // Auto scroll to the bottom
});