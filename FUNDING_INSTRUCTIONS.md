# Smart Contract Deployment - Funding Instructions

## Current Status
The EncryptedGroupMessages smart contract is ready for deployment to Passet chain.

## Wallet Information
- **Current Ethereum Address**: `0x72Db8ea867DfA2Be1A8d6009367b6D4647B5ceA5`
- **Requested Substrate Address**: `5D5d1d6uiscBuzLp6UuYEuZmyt6ciAhbfQq3oeA4dhFJaqTV`
- **Current Balance**: 0 ETH on Passet chain

## Two Options to Proceed:

### Option 1: Fund Current Wallet
Fund the Ethereum address `0x72Db8ea867DfA2Be1A8d6009367b6D4647B5ceA5` with Passet tokens and deploy immediately.

### Option 2: Use Specific Substrate Key
Provide the private key that corresponds to Substrate address `5D5d1d6uiscBuzLp6UuYEuZmyt6ciAhbfQq3oeA4dhFJaqTV`.

## Deployment Command
Once funded, run:
```bash
cd contracts
node direct-deploy.js
```

## Expected Output After Funding
```
🚀 Starting deployment to Passet chain...
Deployer address: 0x[ADDRESS]
Deployer balance: X.XXX ETH
✅ Contract deployed successfully!
📍 Contract address: 0x[CONTRACT_ADDRESS]
```

## Next Steps After Deployment
1. Copy the contract address
2. Update `client/src/lib/contract.ts` with the real address
3. Test blockchain submission in Milkyway2 validator messaging

The smart contract infrastructure is complete and ready - just needs wallet funding to deploy to Passet chain.