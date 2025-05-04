const { Client, AccountId, PrivateKey, ContractId, TransactionId } = require("@hashgraph/sdk");

// Set up Hedera client
const client = Client.forTestnet().setOperator(AccountId.fromString("0.0.4515812"), PrivateKey.fromString("3030020100300706052b8104000a042204209c4ef546bcda3d7cc377d1acfe9036828e1e1c3e2129e4d0f245132302da5c76"));

// Define contract ID and transaction ID (this would be the transaction ID from a previous contract call)
const contractId = ContractId.fromString("0.0.5917455");
const transactionId = TransactionId.fromString("0.0.1234567-1"); // Example transaction ID from a past transaction

// Function to fetch transaction record and logs
async function fetchPastLogs() {
    try {
        // Fetch the transaction record
        const transactionRecord = await client.getTransactionRecord(transactionId);
        console.log("Transaction record:", transactionRecord);

        // Get logs from the transaction record
        const logs = transactionRecord.logs;

        logs.forEach((log, index) => {
            console.log(`Log #${index}:`, log);

            // Parse logs for "ReviewCreated" event or other events as needed
            if (log.includes("ReviewCreated")) {
                const decodedEvent = decodeReviewCreatedEvent(log);
                console.log("Decoded ReviewCreated Event:", decodedEvent);
            }
        });
    } catch (error) {
        console.error("Error fetching past logs:", error);
    }
}

// Function to decode "ReviewCreated" event
function decodeReviewCreatedEvent(log) {
    // A simple example of how you might decode the log manually
    const eventData = log.split(";");
    const reviewer = eventData[0];
    const product = eventData[1];
    const reviewId = eventData[2];
    const reviewText = eventData[3];
    const reputationAtReviewTime = eventData[4];

    return {
        reviewer,
        product,
        reviewId,
        reviewText,
        reputationAtReviewTime,
    };
}

// Fetch logs for a past transaction
fetchPastLogs();