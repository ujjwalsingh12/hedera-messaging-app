
const { Client, PrivateKey, AccountId, PublicKey } = require("@hashgraph/sdk");

async function signMessage() {
    // Initialize the client
    const client = Client.forTestnet(); // or forMainnet()
    
    // Load your private key
    const privateKey = PrivateKey.fromString("3030020100300706052b8104000a042204209c4ef546bcda3d7cc377d1acfe9036828e1e1c3e2129e4d0f245132302da5c76");
    
    // Message to sign
    const message = "Hello, Hedera!";
    
    // Sign the message
    let signature = privateKey.sign(message);
    
    console.log("Signature: ", signature.toString());
    signature = Buffer.from(signature).toString('hex');
    return { message, signature };
}

// signMessage();
async function verifySignature(message, signature) {
    const publicKey = PublicKey.fromString("302d300706052b8104000a032200027c139a504d8b5f6fe3f706b1173320e8188fc6dff7925ca80db707de75204e3f");
    const g = Buffer.from(signature, 'hex');
    // Verify the signature
    const isValid = publicKey.verify(message, g);
    
    console.log("Is the signature valid? ", isValid);
}

// Usage example
(async () => {
    const { message, signature } = await signMessage();
    await verifySignature(message, signature);
})();

