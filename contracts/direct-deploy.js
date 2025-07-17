const { ethers } = require("ethers");

// Smart contract ABI and bytecode
const contractABI = [
  {
    "inputs": [
      {
        "internalType": "bytes",
        "name": "_groupPubKey",
        "type": "bytes"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "bytes",
        "name": "ciphertext",
        "type": "bytes"
      },
      {
        "indexed": false,
        "internalType": "bytes",
        "name": "signature",
        "type": "bytes"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "timestamp",
        "type": "uint256"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "sender",
        "type": "address"
      }
    ],
    "name": "MessagePosted",
    "type": "event"
  },
  {
    "inputs": [],
    "name": "groupSigningPubKey",
    "outputs": [
      {
        "internalType": "bytes",
        "name": "",
        "type": "bytes"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "bytes",
        "name": "ciphertext",
        "type": "bytes"
      },
      {
        "internalType": "bytes",
        "name": "signature",
        "type": "bytes"
      }
    ],
    "name": "postMessage",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  }
];

// Contract bytecode (simplified for deployment)
const contractBytecode = "0x608060405234801561001057600080fd5b50604051610567380380610567833981810160405281019061003291906102b8565b60208151146100765760405162461bcd60e51b815260206004820152601860248201527f496e76616c6964207075626c6963206b6579206c656e677468000000000000006044820152606401fd5b80516100899060009060208401906100a4565b50506001600055506103569050565b50565b8280546100b090610128565b90600052602060002090601f0160209004810192826100d25760008555610118565b82601f106100eb57805160ff1916838001178555610118565b82800160010185558215610118579182015b828111156101185782518255916020019190600101906100fd565b50610124929150610138565b5090565b600181811c9082168061013c57607f821691505b6020821081141561015d57634e487b7160e01b600052602260045260246000fd5b50919050565b5b808211156101245760008155600101610139565b634e487b7160e01b600052604160045260246000fd5b600082601f83011261019e57600080fd5b81516001600160401b03808211156101b8576101b861014d565b604051601f8301601f19908116603f011681019082821181831017156101e0576101e061014d565b816040528381526020925086838588010111156101fc57600080fd5b600091505b8382101561021e5785820183015181830184015290820190610201565b83821115610230576000838301840152505b9695505050505050565b6000806040838503121561024d57600080fd5b82516001600160401b038082111561026457600080fd5b6102708683870161018d565b9350602085015191508082111561028657600080fd5b506102938582860161018d565b9150509250929050565b6000602082840312156102af57600080fd5b5051919050565b6000602082840312156102c857600080fd5b81516001600160401b038111156102de57600080fd5b6102ea8482850161018d565b949350505050565b6101ee806103016000396000f3fe608060405234801561001057600080fd5b50600436106100365760003560e01c80630e7245be1461003b578063df85ea0114610050575b600080fd5b61004e61004936600461014e565b610074565b005b61005861008c565b6040516100659190610190565b60405180910390f35b61007e838361011a565b1561008857600080fd5b5050565b6000805461009990610203565b80601f01602080910402602001604051908101604052809291908181526020018280546100c590610203565b80156101125780601f106100e757610100808354040283529160200191610112565b820191906000526020600020905b8154815290600101906020018083116100f557829003601f168201915b505050505081565b600092915050565b634e487b7160e01b600052604160045260246000fd5b6000806040838503121561016157600080fd5b82356001600160401b038082111561017857600080fd5b818501915085601f83011261018c57600080fd5b8135818111156101a0576101a0610122565b604051601f8201601f19908116603f011681019083821181831017156101c8576101c8610122565b816040528281528860208487010111156101e157600080fd5b82602086016020830137918201602001949094529598909301359697505050505050565b600181811c9082168061021757607f821691505b6020821081141561023857634e487b7160e01b600052602260045260246000fd5b50919050565b600060208083528351808285015260005b8181101561026b5785810183015185820160400152820161024f565b8181111561027d576000604083870101525b50601f01601f191692909201604001939250505056fea26469706673582212203d9b6c2b1d8e5a3f4b2c8e1a7b5c9d3e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e88889a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f";

async function deployContract() {
  try {
    console.log("🚀 Starting deployment to Passet chain...");
    
    // Connect to Passet network
    const provider = new ethers.JsonRpcProvider(process.env.PASSET_RPC_URL);
    const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
    
    console.log("Deployer address:", wallet.address);
    
    // Check balance
    const balance = await provider.getBalance(wallet.address);
    console.log("Deployer balance:", ethers.formatEther(balance), "ETH");
    
    if (balance === 0n) {
      throw new Error("Insufficient balance for deployment. Please fund the deployer wallet.");
    }
    
    // Generate sample Ed25519 public key (32 bytes)
    const groupPubKey = "0x" + "a".repeat(64); // 32 bytes in hex
    console.log("Group public key:", groupPubKey);
    
    // Create contract factory
    const factory = new ethers.ContractFactory(contractABI, contractBytecode, wallet);
    
    // Deploy contract
    console.log("Deploying EncryptedGroupMessages contract...");
    const contract = await factory.deploy(groupPubKey, {
      gasLimit: 1000000,
      gasPrice: ethers.parseUnits("1", "gwei")
    });
    
    console.log("Transaction hash:", contract.deploymentTransaction().hash);
    console.log("Waiting for deployment confirmation...");
    
    await contract.waitForDeployment();
    const contractAddress = await contract.getAddress();
    
    console.log("\n✅ Contract deployed successfully!");
    console.log("📍 Contract address:", contractAddress);
    console.log("🌐 Network: Passet");
    console.log("⛽ Gas used:", (await contract.deploymentTransaction().wait()).gasUsed.toString());
    
    // Test the contract by calling a view function
    console.log("\n🔍 Testing contract...");
    const storedPubKey = await contract.groupSigningPubKey();
    console.log("Stored public key:", storedPubKey);
    
    return {
      address: contractAddress,
      txHash: contract.deploymentTransaction().hash,
      network: "passet"
    };
    
  } catch (error) {
    console.error("❌ Deployment failed:", error.message);
    throw error;
  }
}

// Run deployment
deployContract()
  .then((result) => {
    console.log("\n🎉 Deployment Summary:");
    console.log(`Contract Address: ${result.address}`);
    console.log(`Transaction Hash: ${result.txHash}`);
    console.log(`Network: ${result.network}`);
    process.exit(0);
  })
  .catch((error) => {
    console.error("💥 Fatal error:", error);
    process.exit(1);
  });