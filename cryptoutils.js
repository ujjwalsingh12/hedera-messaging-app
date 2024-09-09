const crypto = require('crypto');

// Convert DER-encoded key to PEM format
function convertDerToPem(derKey, type) {
    let typeLabel;
    if (type === 'private') {
        typeLabel = 'PRIVATE';
    } else if (type === 'public') {
        typeLabel = 'PUBLIC';
    } else {
        throw new Error('Invalid key type. Use "private" or "public".');
    }

    const keyBase64 = Buffer.from(derKey, 'binary').toString('base64');
    return `-----BEGIN ${typeLabel} KEY-----\n` +
           keyBase64.match(/.{1,64}/g).join('\n') +
           '\n-----END ${typeLabel} KEY-----\n';
}

// Sign a message using a private key
function signMessage(privateKeyDer, message) {
    try {
        const privateKeyPem = convertDerToPem(Buffer.from(privateKeyDer, 'binary'), 'private');
        const sign = crypto.createSign('SHA256');
        sign.update(message);
        sign.end();
        return sign.sign(privateKeyPem, 'hex');
    } catch (error) {
        throw new Error(`Error signing message: ${error.message}`);
    }
}

// Verify a signed message using a public key
function verifyMessage(publicKeyDer, message, signature) {
    try {
        const publicKeyPem = convertDerToPem(Buffer.from(publicKeyDer, 'binary'), 'public');
        const verify = crypto.createVerify('SHA256');
        verify.update(message);
        verify.end();
        return verify.verify(publicKeyPem, signature, 'hex');
    } catch (error) {
        throw new Error(`Error verifying message: ${error.message}`);
    }
}

module.exports = {
    signMessage,
    verifyMessage
};
