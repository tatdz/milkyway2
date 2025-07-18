# Smart Contract Deployment Instructions

## EncryptedGroupMessages Contract

The smart contract has been prepared and is ready for deployment to Passet chain.

### Prerequisites

1. **Funded Wallet**: The deployer wallet needs to be funded with Passet native tokens for gas fees.

2. **Network Details**: 
   - Chain ID: 88888 (Passet testnet)
   - RPC URL: Configured via PASSET_RPC_URL environment variable
   - Gas Price: 1 gwei

### Deployment Steps

Once the wallet is funded:

```bash
cd contracts
node direct-deploy.js
```

### Expected Output

```
🚀 Starting deployment to Passet chain...
Deployer address: 0x[WALLET_ADDRESS]
Deployer balance: X.XXX ETH
Group public key: 0xaaaa...aaaa
Deploying EncryptedGroupMessages contract...
Transaction hash: 0x...
Waiting for deployment confirmation...

✅ Contract deployed successfully!
📍 Contract address: 0x[DEPLOYED_ADDRESS]
🌐 Network: Passet
⛽ Gas used: XXXXX

🔍 Testing contract...
Stored public key: 0xaaaa...aaaa

🎉 Deployment Summary:
Contract Address: 0x[DEPLOYED_ADDRESS]
Transaction Hash: 0x[TX_HASH]
Network: passet
```

### Post-Deployment

1. **Update Frontend**: Copy the deployed contract address and update `client/src/lib/contract.ts`:
   ```typescript
   export const CONTRACT_ADDRESSES = {
     passet: "0x[DEPLOYED_ADDRESS]", // Replace with actual address
     localhost: "0x0000000000000000000000000000000000000000",
   };
   ```

2. **Test Integration**: The contract will be accessible via the Milkyway2 validator messaging interface.

### Contract Features

- **postMessage(bytes ciphertext, bytes signature)**: Submit encrypted messages on-chain
- **groupSigningPubKey()**: Get the Ed25519 public key for the validator group
- **MessagePosted event**: Emitted when messages are successfully posted

### Security Notes

- Messages are encrypted client-side before submission
- Ed25519 signatures ensure message authenticity
- All messages are permanently stored on Passet chain
- Contract is immutable once deployed

### Funding Requirements

Approximately 0.001-0.01 Passet tokens needed for deployment gas fees. Contact Passet network for testnet faucet access.