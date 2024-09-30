const accountsArray = [
    {
        "account_id": "0.0.4515812",
        "private_key": "3030020100300706052b8104000a042204209c4ef546bcda3d7cc377d1acfe9036828e1e1c3e2129e4d0f245132302da5c76",
        "public_key": "302d300706052b8104000a032200027c139a504d8b5f6fe3f706b1173320e8188fc6dff7925ca80db707de75204e3f",
        "private_key_hex": "0x9c4ef546bcda3d7cc377d1acfe9036828e1e1c3e2129e4d0f245132302da5c76"
    },
    {
        "account_id": "0.0.4819262",
        "private_key": "3030020100300706052b8104000a0422042022eb8de6966d23dea56a7217f21644438765272d1a03c7a961ba1b126fba94d0"
    },
    {   
        "account_id": "0.0.4892918",
        "public_key": "302a300506032b65700321004da8812bfbaf3c0e2bea9e208554e8da39e26aa235ae4abf3dc422713820b119",
        "private_key": "302e020100300506032b6570042204205688858e192500e654a431a3ff083209d0a1e8e0b158f3d05d631d5cb22fe253"
    },
    {   
        "account_id": "0.0.4893232",
        "public_key": "302a300506032b65700321007abc95891ce7925bc651115989b32b0e8da1406fcac2ae7a4a451e69cfe30f82",
        "private_key": "302e020100300506032b657004220420e2af574473ad438bc1750389c708f7a8a1a33d4eb4d1dda32014ba742606c49e"
    },
    {   
        "account_id": "0.0.4893235",
        "public_key": "302a300506032b6570032100506c881880b72fbc868f68ed5d2467aad320b97085433560a66c74d98084f732",
        "private_key": "302e020100300506032b657004220420c5341580f4e5aed20a90ffc8867a7ce498ed17d66e182165b2a78afce9a7fa9c"
    },
    {
        "account_id": "0.0.4893253",
        "public_key": "302a300506032b6570032100deef8d1570650d0104967e11827dec616991c1917e1da7c3c361343fa2b079db",
        "private_key": "302e020100300506032b6570042204206344f19e144da04cd502cbfbf5dfa9b7dbccad1b6b04caa62348e565bd0071ce"
    },
    {
        "account_id": "0.0.4893261",
        "public_key": "302a300506032b65700321006be4fd54527fe2590a5c3328f23feb949bac196c699ff06fa355d2d46b066a67",
        "private_key": "302e020100300506032b6570042204204f4c011417a6fadee9fe7e66e9a7168372533000be9c37692e2ad86c032a5ad7"
    }
];

const accountsObject = accountsArray.reduce((acc, account) => {
    acc[account.account_id] = {
        private_key: account.private_key,
        public_key: account.public_key,
        private_key_hex: account.private_key_hex || null // Handle optional property
    };
    return acc;
}, {});

console.log(JSON.stringify(accountsObject));