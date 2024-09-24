const { Client, TopicCreateTransaction, TopicMessageQuery, TopicMessageSubmitTransaction } = require("@hashgraph/sdk");

require("dotenv").config();

const client = Client.forTestnet();
client.setOperator(process.env["HEDERA_ACCOUNT_ID"], process.env["HEDERA_PRIVATE_KEY"]);


async function send(params) {
    //Create the transaction
    const transaction = await new TopicMessageSubmitTransaction()
        .setTopicId("0.0.4893302")
        .setMessage("0.0.4894959");
    const response = await transaction.execute(client);
    const receipt = await response.getReceipt(client);
    console.log(response);
    console.log(receipt);
    //Get the transaction message
    const getMessage = transaction.getMessage();
    const ans = Buffer.from(getMessage).toString();
    console.log(ans);
}
async function get(params) {
    new TopicMessageQuery()
        .setTopicId("0.0.4893302")
        .setStartTime(0)
        .subscribe(
            client,
            (message) => console.log(Buffer.from(message.contents, "utf8").toString())
        );
}
get();
// send();
//v2.0.0
