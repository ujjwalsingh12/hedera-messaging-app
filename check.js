require('dotenv').config();
const { signMessage, verifyMessage } = require('./cryptoutils');

// Load keys from environment variables
const privateKeyDer = process.env.HEDERA_PRIVATE_KEY;
const publicKeyDer = process.env.HEDERA_PUBLIC_KEY;

// Define a test message
const testMessage = 'Test message for digital signature';

try {
    // Sign the message
    const signature = signMessage(privateKeyDer, testMessage);
    console.log('Signature:', signature);

    // Verify the message
    const isValid = verifyMessage(publicKeyDer, testMessage, signature);
    console.log('Is the signature valid?', isValid);
} catch (error) {
    console.error('Error during testing:', error.message);
}
