// Smart contract integration for EncryptedGroupMessages
// Using Polkadot/SubWallet ecosystem for Passet chain interactions

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
  private signer: { address: string; injector: any } | null = null;

  constructor(
    private contractAddress: string,
    private chainId: number = 88888 // Passet chain ID
  ) {}

  async connect() {
    // Use SubWallet or Polkadot.js extension for Passet chain
    try {
      const { web3Enable, web3FromAddress } = await import("@polkadot/extension-dapp");
      
      // Enable the extension
      const extensions = await web3Enable("Milkyway2");
      
      if (extensions.length === 0) {
        throw new Error('SubWallet or Polkadot.js extension not found. Please install SubWallet for Passet chain interactions.');
      }

      // Get stored account from localStorage
      const account = localStorage.getItem("milkyway2_account");
      if (!account) {
        throw new Error('Please connect your SubWallet first in the main application.');
      }

      // Get the injector for signing
      const injector = await web3FromAddress(account);
      
      // Store connection info for Passet chain interactions
      this.signer = { address: account, injector };
      
      console.log('Connected to SubWallet for Passet chain:', account);
      
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
      // For now, simulate the transaction since Passet chain contract deployment is pending
      // In real implementation, this would use Polkadot API to interact with the Passet chain
      const mockTxHash = "0x" + Array.from(crypto.getRandomValues(new Uint8Array(32)))
        .map(b => b.toString(16).padStart(2, '0')).join('');
      
      console.log('Simulated Passet chain transaction via SubWallet:', mockTxHash);
      console.log('Message data:', { ciphertext: ciphertext.slice(0, 20) + '...', signature: signature.slice(0, 20) + '...' });
      
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      return mockTxHash;
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