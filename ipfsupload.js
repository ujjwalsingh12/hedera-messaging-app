const { Web3Storage } = require('web3.storage')

function getAccessToken() {
    // Replace with your token from https://web3.storage
    return 'YOUR_WEB3_STORAGE_API_TOKEN'
}

function makeStorageClient() {
    return new Web3Storage({ token: getAccessToken() })
}

export async function uploadUserMetadataToIPFS(userData) {
    const client = makeStorageClient()
    const blob = new Blob([JSON.stringify(userData)], { type: 'application/json' })
    const files = [new File([blob], 'user.json')]

    const cid = await client.put(files)
    console.log('📦 Stored files with CID:', cid)
    return cid
}

const userData = {
    name: "Ujjwal",
    age: 24,
    location: "India",
    profilePicUrl: "https://example.com/ujjwal.jpg"
}

const ipfsHash = await uploadUserMetadataToIPFS(userData)
console.log("🎯 IPFS CID:", ipfsHash)