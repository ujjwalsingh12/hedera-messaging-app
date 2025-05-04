const { PrivateKey } = require("@hashgraph/sdk");

// Your DER key in base64 format
const base64 = "3030020100300706052b8104000a042204209c4ef546bcda3d7cc377d1acfe9036828e1e1c3e2129e4d0f245132302da5c76";

// Convert base64 to bytes
const derBytes = Buffer.from(base64, "base64");

// Parse it using the SDK
const privateKey = PrivateKey.fromBytes(derBytes);

const hex = Buffer.from(base64, "base64").toString("hex");

console.log("Parsed Private Key:", hex);