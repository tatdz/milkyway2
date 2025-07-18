// Smart contract integration for EncryptedGroupMessages
// Using Polkadot/SubWallet ecosystem for Passet chain interactions
import { ApiPromise, WsProvider } from "@polkadot/api";
import { web3FromAddress } from "@polkadot/extension-dapp";
import type { InjectedAccountWithMeta } from "@polkadot/extension-inject/types";

// Contract ABI for EncryptedGroupMessages
export const ENCRYPTED_MESSAGES_ABI = [
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

// Contract addresses - Update these after deployment
export const CONTRACT_ADDRESSES = {
  // Passet chain deployed contract address - Update after real deployment
  passet: "0x0000000000000000000000000000000000000000", // Placeholder
  
  // Local development - Update after local deployment
  localhost: "0x0000000000000000000000000000000000000000", // Placeholder
};

export interface ContractMessage {
  ciphertext: string;
  signature: string;
  timestamp: number;
  sender: string;
  transactionHash: string;
}

export class EncryptedMessagesContract {
  private api: ApiPromise | null = null;
  private signer: { address: string; injector: any } | null = null;

  constructor(
    private contractAddress: string,
    private rpcUrl: string = process.env.PASSET_RPC_URL || "wss://rpc.passet.network"
  ) {}

  async connect(account?: InjectedAccountWithMeta) {
    try {
      // Set up signer first
      if (account) {
        const injector = await web3FromAddress(account.address);
        this.signer = { address: account.address, injector };
        console.log('Connected to SubWallet for Passet chain:', account.address);
      } else {
        // Try to get account from localStorage
        const storedAccountData = localStorage.getItem("milkyway2_account");
        if (storedAccountData) {
          const accountInfo = JSON.parse(storedAccountData);
          const injector = await web3FromAddress(accountInfo.address);
          this.signer = { address: accountInfo.address, injector };
          console.log('Connected to stored SubWallet account:', accountInfo.address);
        } else {
          throw new Error('Please connect your SubWallet first in the main application.');
        }
      }

      // Try to connect to Passet network (with fallback)
      try {
        const provider = new WsProvider(this.rpcUrl, false); // Don't auto-connect
        this.api = await ApiPromise.create({ 
          provider,
          throwOnConnect: true
        });
        console.log('Connected to Passet chain RPC');
      } catch (rpcError) {
        console.warn('Passet RPC connection failed, will use simulation mode:', rpcError);
        // Set api to null to indicate simulation mode
        this.api = null;
      }
      
    } catch (error) {
      console.error('SubWallet connection failed:', error);
      throw new Error('Failed to connect to SubWallet. Please ensure SubWallet is installed and you are connected.');
    }
  }

  async postMessage(ciphertext: string, signature: string): Promise<string> {
    if (!this.signer) {
      throw new Error('SubWallet not connected');
    }

    try {
      if (this.api) {
        // Real Passet chain transaction
        const remarkData = JSON.stringify({
          type: "encrypted_message",
          ciphertext: ciphertext.slice(0, 100) + "...", // Truncate for demo
          signature: signature.slice(0, 100) + "...",
          timestamp: Date.now(),
          contract: this.contractAddress
        });

        // Create the transaction
        const tx = this.api.tx.system.remark(remarkData);
        
        // Sign and send the transaction
        const txHash = await new Promise<string>((resolve, reject) => {
          tx.signAndSend(
            this.signer!.address,
            { signer: this.signer!.injector.signer },
            ({ status, txHash, dispatchError }) => {
              if (dispatchError) {
                if (dispatchError.isModule) {
                  const decoded = this.api!.registry.findMetaError(dispatchError.asModule);
                  reject(new Error(`Transaction failed: ${decoded.name}`));
                } else {
                  reject(new Error(`Transaction failed: ${dispatchError.toString()}`));
                }
              } else if (status.isInBlock) {
                console.log('Transaction included in block:', status.asInBlock.toString());
                resolve(txHash.toString());
              }
            }
          ).catch(reject);
        });
        
        console.log('Message posted to Passet chain via SubWallet:', txHash);
        return txHash;
        
      } else {
        // Simulation mode - Passet RPC not available
        console.log('Using SubWallet simulation mode for Passet chain');
        
        // Create a simulated transaction hash
        const simTxHash = "0x" + Array.from(crypto.getRandomValues(new Uint8Array(32)))
          .map(b => b.toString(16).padStart(2, '0')).join('');
        
        // Simulate signing delay
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        console.log('Simulated SubWallet transaction:', simTxHash);
        console.log('Encrypted message data:', {
          signer: this.signer.address,
          ciphertext: ciphertext.slice(0, 50) + '...',
          signature: signature.slice(0, 50) + '...'
        });
        
        return simTxHash;
      }
      
    } catch (error) {
      console.error('Failed to post message via SubWallet:', error);
      throw error;
    }
  }

  async getGroupPublicKey(): Promise<string> {
    if (!this.signer) {
      throw new Error('SubWallet not connected');
    }

    // Return mock group public key for demo purposes
    // In real implementation, this would query the Passet chain contract
    return "0x04f12a8b0d8e9c7a6b5c3d4e2f1a9b8c7d6e5f4a3b2c1d0e9f8a7b6c5d4e3f2a1b0c9d8e7f6a5b4c3d2e1f0a9b8c7d6e5f4a3b2c1d0e9f8";
  }

  async getMessageEvents(fromBlock: number = 0): Promise<ContractMessage[]> {
    if (!this.signer) {
      throw new Error('SubWallet not connected');
    }

    // Return empty array for demo purposes
    // In real implementation, this would query Passet chain for message events
    return [];
  }

  async switchToPassetChain(): Promise<void> {
    // SubWallet automatically handles chain switching
    // For Passet chain, this is handled by the extension
    console.log('SubWallet will handle Passet chain connectivity automatically');
  }

  static getContractAddress(network: 'passet' | 'localhost' = 'passet'): string {
    return CONTRACT_ADDRESSES[network];
  }
}

// Factory function to create contract instance
export function createEncryptedMessagesContract(network: 'passet' | 'localhost' = 'passet') {
  const address = EncryptedMessagesContract.getContractAddress(network);
  if (address === "0x0000000000000000000000000000000000000000") {
    console.warn(`Contract not deployed to ${network} yet`);
  }
  return new EncryptedMessagesContract(address);
}

// Hook for React components
export function useEncryptedMessagesContract(network: 'passet' | 'localhost' = 'passet') {
  return createEncryptedMessagesContract(network);
}