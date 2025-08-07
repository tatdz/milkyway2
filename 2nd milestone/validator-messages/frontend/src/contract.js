import { ethers } from 'ethers';

const CONTRACT_ADDRESS = "0xab7Efe5037b07436eb803aAE806EEb20FDb566F8";

// Direct ABI (paste/full, not skipped)
const CONTRACT_ABI = [
  { "inputs": [], "stateMutability": "nonpayable", "type": "constructor" },
  { "anonymous": false, "inputs": [
      { "indexed": true, "internalType": "address", "name": "validator", "type": "address" },
      { "indexed": true, "internalType": "address", "name": "nominator", "type": "address" },
      { "indexed": true, "internalType": "uint256", "name": "era", "type": "uint256" },
      { "indexed": false, "internalType": "string", "name": "content", "type": "string" },
      { "indexed": false, "internalType": "bytes32", "name": "txHash", "type": "bytes32" }
    ], "name": "MessageSubmitted", "type": "event" },
  { "inputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "name": "allMessages", "outputs": [
      { "internalType": "address", "name": "validator", "type": "address" },
      { "internalType": "address", "name": "nominator", "type": "address" },
      { "internalType": "string", "name": "content", "type": "string" },
      { "internalType": "uint256", "name": "era", "type": "uint256" },
      { "internalType": "bytes32", "name": "txHash", "type": "bytes32" }
    ], "stateMutability": "view", "type": "function" },
  { "inputs": [], "name": "getAllMessages", "outputs": [
      { "components": [
        { "internalType": "address", "name": "validator", "type": "address" },
        { "internalType": "address", "name": "nominator", "type": "address" },
        { "internalType": "string", "name": "content", "type": "string" },
        { "internalType": "uint256", "name": "era", "type": "uint256" },
        { "internalType": "bytes32", "name": "txHash", "type": "bytes32" }
      ],
      "internalType": "struct ValidatorMessages.Message[]",
      "name": "",
      "type": "tuple[]"
      }
    ], "stateMutability": "view", "type": "function" },
  { "inputs": [
      { "internalType": "address", "name": "validatorFilter", "type": "address" },
      { "internalType": "address", "name": "nominatorFilter", "type": "address" },
      { "internalType": "uint256", "name": "offset", "type": "uint256" },
      { "internalType": "uint256", "name": "limit", "type": "uint256" }
    ], "name": "getMessages", "outputs": [
      { "components": [
        { "internalType": "address", "name": "validator", "type": "address" },
        { "internalType": "address", "name": "nominator", "type": "address" },
        { "internalType": "string", "name": "content", "type": "string" },
        { "internalType": "uint256", "name": "era", "type": "uint256" },
        { "internalType": "bytes32", "name": "txHash", "type": "bytes32" }
      ],
      "internalType": "struct ValidatorMessages.Message[]",
      "name": "",
      "type": "tuple[]"
      }
    ], "stateMutability": "view", "type": "function" },
  { "inputs": [
      { "internalType": "address", "name": "nominator", "type": "address" }
    ], "name": "getMessagesByNominator", "outputs": [
      { "components": [
        { "internalType": "address", "name": "validator", "type": "address" },
        { "internalType": "address", "name": "nominator", "type": "address" },
        { "internalType": "string", "name": "content", "type": "string" },
        { "internalType": "uint256", "name": "era", "type": "uint256" },
        { "internalType": "bytes32", "name": "txHash", "type": "bytes32" }
      ],
      "internalType": "struct ValidatorMessages.Message[]",
      "name": "",
      "type": "tuple[]"
      }
    ], "stateMutability": "view", "type": "function" },
  { "inputs": [
      { "internalType": "address", "name": "validator", "type": "address" }
    ], "name": "getMessagesByValidator", "outputs": [
      { "components": [
        { "internalType": "address", "name": "validator", "type": "address" },
        { "internalType": "address", "name": "nominator", "type": "address" },
        { "internalType": "string", "name": "content", "type": "string" },
        { "internalType": "uint256", "name": "era", "type": "uint256" },
        { "internalType": "bytes32", "name": "txHash", "type": "bytes32" }
      ],
      "internalType": "struct ValidatorMessages.Message[]",
      "name": "",
      "type": "tuple[]"
      }
    ], "stateMutability": "view", "type": "function" },
  { "inputs": [], "name": "getTotalMessageCount", "outputs": [
      { "internalType": "uint256", "name": "", "type": "uint256" }
    ], "stateMutability": "view", "type": "function" },
  { "inputs": [
      { "internalType": "address", "name": "", "type": "address" },
      { "internalType": "uint256", "name": "", "type": "uint256" }
    ], "name": "nominatorToMessages", "outputs": [
      { "internalType": "address", "name": "validator", "type": "address" },
      { "internalType": "address", "name": "nominator", "type": "address" },
      { "internalType": "string", "name": "content", "type": "string" },
      { "internalType": "uint256", "name": "era", "type": "uint256" },
      { "internalType": "bytes32", "name": "txHash", "type": "bytes32" }
    ], "stateMutability": "view", "type": "function" },
  { "inputs": [
      { "internalType": "address", "name": "validator", "type": "address" },
      { "internalType": "string", "name": "content", "type": "string" },
      { "internalType": "uint256", "name": "era", "type": "uint256" },
      { "internalType": "bytes32", "name": "txHash", "type": "bytes32" }
    ], "name": "submitMessage", "outputs": [], "stateMutability": "nonpayable", "type": "function" },
  { "inputs": [
      { "internalType": "address", "name": "", "type": "address" },
      { "internalType": "uint256", "name": "", "type": "uint256" }
    ], "name": "validatorToMessages", "outputs": [
      { "internalType": "address", "name": "validator", "type": "address" },
      { "internalType": "address", "name": "nominator", "type": "address" },
      { "internalType": "string", "name": "content", "type": "string" },
      { "internalType": "uint256", "name": "era", "type": "uint256" },
      { "internalType": "bytes32", "name": "txHash", "type": "bytes32" }
    ], "stateMutability": "view", "type": "function" }
];

const ETHERSCAN_URL = "https://sepolia.etherscan.io";

function getProvider() {
  return new ethers.JsonRpcProvider(process.env.REACT_APP_SEPOLIA_RPC_URL || "https://rpc.sepolia.org");
}

function getContract(providerOrSigner) {
  return new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, providerOrSigner);
}

// Fetch all messages
export async function fetchAllMessages() {
  const contract = getContract(getProvider());
  const messages = await contract.getAllMessages();
  return messages.map(formatMessage);
}

export async function fetchNominatorMessages(nominator) {
  const contract = getContract(getProvider());
  const messages = await contract.getMessagesByNominator(nominator);
  return messages.map(formatMessage);
}

export async function fetchValidatorMessages(validator) {
  const contract = getContract(getProvider());
  const messages = await contract.getMessagesByValidator(validator);
  return messages.map(formatMessage);
}

export async function submitMessageToContract({ validator, content, era, txHash }) {
  if (!window.ethereum) throw new Error("Please install MetaMask");
  const browserProvider = new ethers.BrowserProvider(window.ethereum);
  const signer = await browserProvider.getSigner();
  const contract = getContract(signer);

  let txHashArg = txHash;
  if (!txHashArg || !/^0x([0-9a-fA-F]{64})$/.test(txHashArg)) {
    txHashArg = ethers.id(Date.now().toString()).slice(0, 66);
  }

  const tx = await contract.submitMessage(
    validator,
    content,
    Number(era) || 0,
    txHashArg
  );
  return tx;
}

function formatMessage(msg) {
  return {
    ...msg,
    era: msg.era ? Number(msg.era) : 0,
    txUrl: msg.txHash && msg.txHash !== ethers.ZeroHash ? `${ETHERSCAN_URL}/tx/${msg.txHash}` : '',
    validator: msg.validator,
    nominator: msg.nominator,
    content: msg.content
  };
}
