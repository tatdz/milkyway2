// testContract.js
import { ethers } from "ethers";
import * as dotenv from "dotenv";

dotenv.config(); // load .env file for Node.js

const RPC_URL = process.env.REACT_APP_SEPOLIA_RPC_URL;
const CONTRACT_ADDRESS = process.env.REACT_APP_CONTRACT_ADDRESS;
const PRIVATE_KEY = process.env.PRIVATE_KEY; // must be set in .env (without 0x prefix)

if (!RPC_URL) {
  console.error("Error: REACT_APP_SEPOLIA_RPC_URL not set in .env");
  process.exit(1);
}

if (!CONTRACT_ADDRESS) {
  console.error("Error: REACT_APP_CONTRACT_ADDRESS not set in .env");
  process.exit(1);
}

if (!PRIVATE_KEY) {
  console.error("Error: PRIVATE_KEY not set in .env");
  process.exit(1);
}

// Contract ABI (paste your full ABI here; this is a trimmed example)
const CONTRACT_ABI = [
  {
    inputs: [],
    name: "getAllMessages",
    outputs: [
      {
        components: [
          { internalType: "address", name: "validator", type: "address" },
          { internalType: "address", name: "nominator", type: "address" },
          { internalType: "string", name: "content", type: "string" },
          { internalType: "uint256", name: "era", type: "uint256" },
          { internalType: "bytes32", name: "txHash", type: "bytes32" },
        ],
        internalType: "struct ValidatorMessages.Message[]",
        name: "",
        type: "tuple[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "validator", type: "address" },
      { internalType: "string", name: "content", type: "string" },
      { internalType: "uint256", name: "era", type: "uint256" },
      { internalType: "bytes32", name: "txHash", type: "bytes32" },
    ],
    name: "submitMessage",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
];

// Helper to format message for display
function formatMessage(msg) {
  return {
    validator: msg.validator,
    nominator: msg.nominator,
    content: msg.content,
    era: msg.era.toNumber ? msg.era.toNumber() : Number(msg.era),
    txHash: msg.txHash,
  };
}

async function main() {
  // Create JSON RPC provider (ethers v6)
  const provider = new ethers.JsonRpcProvider(RPC_URL);

  // Create wallet/signer for sending transactions
  const wallet = new ethers.Wallet(PRIVATE_KEY, provider);

  // Create contract instance with signer
  const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, wallet);

  // 1. Fetch all messages from contract (read-only call)
  console.log("Fetching all messages...");
  const messages = await contract.getAllMessages();

  console.log(`Found ${messages.length} messages:`);
  messages.forEach((msg, i) => {
    const m = formatMessage(msg);
    console.log(
      `${i + 1}. Validator: ${m.validator}, Nominator: ${m.nominator}, Era: ${m.era}, Content: "${m.content}", txHash: ${m.txHash}`
    );
  });

  // 2. Submit a new message transaction
  const validatorAddress = wallet.address; // for testing, submit with self as validator
  const content = "Test message from ethers.js v6 script";
  const era = 42;
  // Generate a pseudo txHash param (you can adapt this logic)
  const generatedTxHash = ethers.id(Date.now().toString()).slice(0, 66);

  console.log("\nSubmitting a new message...");
  const tx = await contract.submitMessage(
    validatorAddress,
    content,
    era,
    generatedTxHash
  );

  console.log(`Transaction sent: ${tx.hash}`);
  console.log("Waiting for confirmation...");
  const receipt = await tx.wait();
  console.log(`Transaction confirmed in block ${receipt.blockNumber}`);

  // 3. Optionally, re-fetch messages to verify update
  const newMessages = await contract.getAllMessages();
  console.log(`New total messages count: ${newMessages.length}`);
}

// Run main and handle errors
main()
  .then(() => console.log("Test script finished"))
  .catch((err) => {
    console.error("Error running test script:", err);
    process.exit(1);
  });
