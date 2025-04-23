const {
    Client,
    PrivateKey,
    AccountId,
    ContractCallQuery,
    ContractFunctionParameters,
    ContractId,
} = require("@hashgraph/sdk");

require("dotenv").config();

const operatorId = AccountId.fromString("0.0.4819262");
const operatorKey = PrivateKey.fromString(
    "3030020100300706052b8104000a0422042022eb8de6966d23dea56a7217f21644438765272d1a03c7a961ba1b126fba94d0"
);

const contractId = ContractId.fromEvmAddress(
    0,
    0,
    "6798ff106c053e3A3F9A104fc32912a7a4ce7898"
);

const client = Client.forTestnet().setOperator(operatorId, operatorKey);

function isZeroAddress(hexAddress) {
    return /^0x0{40}$/i.test(hexAddress);
}

async function getAllUserMetadata() {
    console.log("🔍 Fetching all registered users...");

    const getUsersQuery = new ContractCallQuery()
        .setContractId(contractId)
        .setGas(150000)
        .setFunction("getAllUsers");

    const usersResult = await getUsersQuery.execute(client);
    const rawBytes = usersResult.bytes;

    const numAddresses = Math.floor(rawBytes.length / 32);
    const addresses = [];

    for (let i = 0; i < numAddresses; i++) {
        const offset = i * 32 + 12; // Skip 12 leading bytes (padding)
        const addrBytes = rawBytes.slice(offset, offset + 20);
        const hexAddr = "0x" + Buffer.from(addrBytes).toString("hex");

        if (!isZeroAddress(hexAddr)) {
            addresses.push(hexAddr);
        }
    }

    if (addresses.length === 0) {
        console.log("❗ No valid addresses found.");
        return;
    }

    console.log(`✅ Found ${addresses.length} users:\n`);

    for (const address of addresses) {
        try {
            const metadataQuery = new ContractCallQuery()
                .setContractId(contractId)
                .setGas(100_000)
                .setFunction(
                    "getUserMetadata",
                    new ContractFunctionParameters().addAddress(address)
                );

            const metadataResult = await metadataQuery.execute(client);
            const metadata = metadataResult.getString(0);

            console.log(`👤 ${address} → ${metadata}`);
        } catch (err) {
            console.error(`❌ Failed to fetch metadata for ${address}: ${err.message}`);
        }
    }
}

getAllUserMetadata().catch(console.error);