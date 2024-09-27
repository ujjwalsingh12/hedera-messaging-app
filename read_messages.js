const axios = require('axios');

async function fetchTopicMessages(topicId) {
  try {
    const url = `https://testnet.mirrornode.hedera.com/api/v1/topics/${topicId}/messages`;
    const response = await axios.get(url);

    // Check if messages are available
    if (response.data && response.data.messages) {
      const messages = response.data.messages;

      // Log message details
      messages.forEach(message => {
        console.log('Message Details:');
        console.log('-------------------');
        // console.log('Topic ID:', message.topic_id);
        console.log('Payer Account ID:', message.payer_account_id);
        console.log('Consensus Timestamp:', message.consensus_timestamp);
        console.log('Sequence Number:', message.sequence_number);
        // console.log('Chunk Info:', message.chunk_info);
        // console.log('Initial Transaction ID:', message.chunk_info.initial_transaction_id);
        
        // Decode the message from Base64
        const decodedMessage = Buffer.from(message.message, 'base64').toString('utf-8');
        console.log('Message:', decodedMessage);
        
        // console.log('Running Hash:', message.running_hash);
        // console.log('Running Hash Version:', message.running_hash_version);
        console.log('-------------------');
      });
    } else {
      console.log('No messages found for this topic.');
    }
  } catch (error) {
    console.error('Error fetching topic messages:', error);
  }
}

// Replace with your topic ID
const topicId = '0.0.4893302';
fetchTopicMessages(topicId);

const args = process.argv.slice(2); // Slice to skip the first two elements

if (args.length === 0) {
  fetchTopicMessages("0.0.4893302");
} else {
  fetchTopicMessages(args[0]);
}

