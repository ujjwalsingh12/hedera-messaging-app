const { Client, TopicMessageSubmitTransaction,PrivateKey, AccountId, PublicKey } = require("@hashgraph/sdk");

require("dotenv").config();
const account = require('./keys.json');
const { sign, Signature } = require("noble-ed25519");
const client = Client.forTestnet();
client.setOperator(process.env["HEDERA_ACCOUNT_ID"], process.env["HEDERA_PRIVATE_KEY"]);

async function sendEncryptedMessage(topicId, encryptedMessage) {
    const transaction = new TopicMessageSubmitTransaction({
        topicId: topicId,
        message: encryptedMessage.toString('base64')  // Convert the encrypted message to base64 format
    });

    const response = await transaction.execute(client);
    const receipt = await response.getReceipt(client);

    console.log(`Encrypted message sent to topic: ${topicId}`);
}


async function signMessage(privateKey,mess) {
    // Initialize the client
    const client = Client.forTestnet(); // or forMainnet()
    
    
    // Message to sign
    const message = mess;
    
    // Sign the message
    const signature = privateKey.sign(message);
    // console.log(signature.hex());
    // console.log("Signature: ", signature.toString());
    return signature;
}


async function send(testData){
    const privateKey = PrivateKey.fromString(account[0].private_key);
    const signature = await signMessage(privateKey, testData);
    console.log('Signature:', signature);
    const message = { "testdata": testData, "signature":Buffer.from(signature).toString('hex')};
    sendEncryptedMessage("0.0.4842073", JSON.stringify(message));
    // const g = Buffer.from(signature).toString('hex');
    // const pk = PublicKey.fromString("302d300706052b8104000a032200027c139a504d8b5f6fe3f706b1173320e8188fc6dff7925ca80db707de75204e3f");
    // const isvalid = pk.verify(testData,Buffer.from(g,'hex'), 'hex');
    // console.log(isvalid);
    // console.log(g);

}






// Replace with your topicId and encrypted message
// send_msg();

const args = process.argv.slice(2); // Slice to skip the first two elements

if (args.length === 0) {
    console.log('No arguments provided.');
} else {
    console.log('Message is: ');
    let s = "";
    args.forEach((arg, index) => {
        s = s + " " + arg;
    });
    testData = s.substring(1);
    send(testData);
}