const {
    Client,
    AccountId,
    PrivateKey,
    ContractExecuteTransaction,
    ContractFunctionParameters,
} = require("@hashgraph/sdk");

// Replace with your testnet credentials
const operatorId = AccountId.fromString("0.0.4515812");
const operatorKey = PrivateKey.fromString("3030020100300706052b8104000a042204209c4ef546bcda3d7cc377d1acfe9036828e1e1c3e2129e4d0f245132302da5c76");

// Replace with your deployed contract address
const contractId = "0.0.5911159"; // Deployed MyTokenOnHedera Contract
const newOwnerAddress = "0x9dcE13673A1528a6a985483Ad0eb0C951b4a76F5"; // New owner address (EVM style, 0x...)

const client = Client.forTestnet().setOperator(operatorId, operatorKey);

async function transferOwnership() {
    // Prepare function call
    const transaction = await new ContractExecuteTransaction()
        .setContractId(contractId)
        .setGas(100_000) // You can adjust gas if needed
        .setFunction(
            "transferOwnership",
            new ContractFunctionParameters().addAddress(newOwnerAddress)
        )
        .execute(client);

    const receipt = await transaction.getReceipt(client);
    console.log("Status:", receipt.status.toString());
}

transferOwnership();