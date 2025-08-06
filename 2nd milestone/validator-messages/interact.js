import { ethers } from 'ethers';

const CONTRACT_ADDRESS = "0xab7Efe5037b07436eb803aAE806EEb20FDb566F8";
const ABI = [
    {
        "inputs": [],
        "name": "getAllMessages",
        "outputs": [
            {
                "components": [
                    {"name": "validator", "type": "address"},
                    {"name": "nominator", "type": "address"},
                    {"name": "content", "type": "string"},
                    {"name": "era", "type": "uint256"},
                    {"name": "txHash", "type": "bytes32"}
                ],
                "internalType": "struct ValidatorMessages.Message[]",
                "name": "",
                "type": "tuple[]"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    }
];

// Add BigInt serialization support
BigInt.prototype.toJSON = function() { return this.toString() };

async function main() {
    const provider = new ethers.JsonRpcProvider(process.env.SEPOLIA_RPC_URL);
    const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, provider);

    try {
        const messages = await contract.getAllMessages();
        
        // Convert messages to serializable format
        const formattedMessages = messages.map(msg => ({
            validator: msg.validator,
            nominator: msg.nominator,
            content: msg.content,
            era: msg.era.toString(), // Convert BigInt to string
            txHash: msg.txHash
        }));
        
        console.log("Messages:", JSON.stringify(formattedMessages, null, 2));
    } catch (error) {
        console.error("Error:", error);
    }
}

main();