const {
    Hbar,
    Client,
    PrivateKey,
    AccountBalanceQuery,
    AccountCreateTransaction,
  } = require("@hashgraph/sdk");
  require("dotenv").config();
  const accounts = require('./keys.json');
  async function environmentSetup() {
    // Grab your Hedera testnet account ID and private key from your .env file
    const myAccountId = accounts[4].account_id;
    const myPrivateKey = accounts[4].private_key;
  
    // If we weren't able to grab it, we should throw a new error
    if (myAccountId == null || myPrivateKey == null) {
      throw new Error(
        "Environment variables myAccountId and myPrivateKey must be present"
      );
    }
  
    // Create your connection to the Hedera Network
    const client = Client.forTestnet();
    client.setOperator(myAccountId, myPrivateKey);
  
    //Set the default maximum transaction fee (in Hbar)
    client.setDefaultMaxTransactionFee(new Hbar(100));
  
    //Set the maximum payment for queries (in Hbar)
    client.setDefaultMaxQueryPayment(new Hbar(50));
  
    // Create new keys
    const newAccountPrivateKey = PrivateKey.generateED25519();
    const newAccountPublicKey = newAccountPrivateKey.publicKey;
  
    // Create a new account with 1,000 tinybar starting balance
    const newAccount = await new AccountCreateTransaction()
      .setKey(newAccountPublicKey)
      .setInitialBalance(Hbar.fromTinybars(1000))
      .execute(client);
  
    // Get the new account ID
    const getReceipt = await newAccount.getReceipt(client);
    const newAccountId = getReceipt.accountId;
    
    console.log("\nNew account ID: " + newAccountId);
  
    // Verify the account balance
    const accountBalance = await new AccountBalanceQuery()
      .setAccountId(newAccountId)
      .execute(client);
      let acc_details = {};
      acc_details[`account_id`] = newAccountId.toString();
      acc_details[`public_key`] = newAccountPublicKey.toString();
      acc_details[`private_key`] =newAccountPrivateKey.toString();
      // Object.entries(acc_details).forEach(([key,value])=>{
      //   console.log(`"${key}":"${value}"`);
      // });
      console.log(JSON.stringify(acc_details));
    console.log(
      "The new account balance is: " +
        accountBalance.hbars +
        " tinybar."
    );
  
    return newAccountId;
  }
  environmentSetup();
  