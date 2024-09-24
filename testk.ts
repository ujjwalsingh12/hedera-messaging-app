const { PrivateKey, PublicKey } = require("@hashgraph/sdk");
const forge = require('node-forge');

const privateKey = PrivateKey.generate();  // Generate new private key
const publicKey = privateKey.publicKey;   // Get corresponding public key

console.log("Private Key:", privateKey.toString());
console.log("Public Key:", publicKey.toString());

const privateKeyHedera = privateKey;

const privateKeyBytes = privateKeyHedera.toBytesRaw();
const privateKeyDer = Buffer.from(privateKeyBytes).toString('binary');
const privateKeyAsn1 = forge.asn1.fromDer(privateKeyDer);
const privateKeyPem = forge.pki.privateKeyToPem(forge.pki.privateKeyFromAsn1(privateKeyAsn1));

console.log("Private Key in PEM format:\n", privateKeyPem);
const publicKeyHedera = publicKey;

// Convert Hedera public key to byte array (Uint8Array)
const publicKeyBytes = publicKeyHedera.toBytesRaw();

// Wrap the byte array into a Buffer object, then convert to string format
const publicKeyDer = Buffer.from(publicKeyBytes).toString('binary');

// Parse the DER encoded public key using forge
const publicKeyAsn1 = forge.asn1.fromDer(publicKeyDer);

// Convert the ASN.1 object to PEM format
const publicKeyPem = forge.pki.publicKeyToPem(forge.pki.publicKeyFromAsn1(publicKeyAsn1));

console.log("Public Key in PEM format:\n", publicKeyPem);