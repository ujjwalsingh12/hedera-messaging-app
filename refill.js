const {
  Client,
  AccountId,
  PrivateKey,
  TransferTransaction,
  Hbar,
} = require("@hashgraph/sdk");

// Replace with your testnet credentials
const operatorId = AccountId.fromString("0.0.4515812");
const operatorKey = PrivateKey.fromString("3030020100300706052b8104000a042204209c4ef546bcda3d7cc377d1acfe9036828e1e1c3e2129e4d0f245132302da5c76");

const client = Client.forTestnet().setOperator(operatorId, operatorKey);

async function sendHbar() {
  const transaction = await new TransferTransaction()
    .addHbarTransfer(operatorId, new Hbar(-10)) // Send 10 HBAR
    .addHbarTransfer("0.0.4893261", new Hbar(10)) // To your account
    .execute(client);

  const receipt = await transaction.getReceipt(client);
  console.log("Status:", receipt.status.toString());
}

sendHbar();
