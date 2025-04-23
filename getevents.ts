const axios = require("axios");
const { AccountId } = require("@hashgraph/sdk");

async function getEventsFromMirror(contractId) {
    const delay = (ms) => new Promise((res) => setTimeout(res, ms));

    console.log(`\nGetting event(s) from mirror node for contract: ${contractId}`);
    console.log(`Waiting 5s to ensure data is available...`);
    await delay(5000);

    const url = `https://testnet.mirrornode.hedera.com/api/v1/contracts/${contractId}/results/logs`;

    try {
        const response = await axios.get(url);
        const logs = response.data.logs;

        if (!logs.length) {
            console.log("No logs found.");
            return;
        }

        console.log(`Found ${logs.length} event log(s):`);
        logs.forEach((log, index) => {
            const fromAddressHex = log.topics[1]; // second topic: indexed `from` address
            const messageHex = log.data; // encoded message as hex

            // Convert message from hex to UTF-8 string
            const messageUtf8 = Buffer.from(messageHex.slice(2), 'hex').toString("utf8");

            // Convert solidity address to Hedera AccountId (this is optional and only works if the address is known)
            let fromAccountId = "Unknown (0x" + fromAddressHex.slice(26) + ")";
            try {
                fromAccountId = AccountId.fromSolidityAddress(fromAddressHex).toString();
            } catch (err) {
                console.warn("Failed to decode from address:", err.message);
            }

            console.log(`\nEvent #${index + 1}`);
            console.log(`From: ${fromAccountId}`);
            console.log(`Message: ${messageUtf8}`);
        });
    } catch (err) {
        console.error("Error fetching logs from mirror node:", err.message);
    }
}

// Example usage (replace with your contract ID)
const CONTRACT_ID = "0.0.5860245"; // <- 🔁 Replace this with your actual contract ID
getEventsFromMirror(CONTRACT_ID);