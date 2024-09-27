const { Client, PublicKey } = require("@hashgraph/sdk");

async function verifySignature(message, signature) {
    const publicKey = PublicKey.fromString("YOUR_PUBLIC_KEY");
    
    // Verify the signature
    const isValid = publicKey.verify(message, signature);
    
    console.log("Is the signature valid? ", isValid);
}

// Usage example
(async () => {
    const { message, signature } = await signMessage();
    await verifySignature(message, signature);
})();
