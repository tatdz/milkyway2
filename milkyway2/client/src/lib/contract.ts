// Smart contract integration for EncryptedGroupMessages
import { ethers } from "ethers";

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
  private contract: ethers.Contract | null = null;
  private provider: ethers.BrowserProvider | null = null;
  private signer: ethers.Signer | null = null;

  constructor(
    private contractAddress: string,
    private chainId: number = 88888 // Passet chain ID
  ) {}

  async connect() {
    if (typeof window.ethereum === 'undefined') {
      throw new Error('MetaMask or compatible wallet not found');
    }

    this.provider = new ethers.BrowserProvider(window.ethereum);
    this.signer = await this.provider.getSigner();
    this.contract = new ethers.Contract(
      this.contractAddress,
      ENCRYPTED_MESSAGES_ABI,
      this.signer
    );
  }

  async postMessage(ciphertext: string, signature: string): Promise<string> {
    if (!this.contract) {
      throw new Error('Contract not connected');
    }

    // Convert hex strings to bytes
    const ciphertextBytes = ethers.getBytes(ciphertext.startsWith('0x') ? ciphertext : '0x' + ciphertext);
    const signatureBytes = ethers.getBytes(signature.startsWith('0x') ? signature : '0x' + signature);

    try {
      const tx = await this.contract.postMessage(ciphertextBytes, signatureBytes);
      console.log('Transaction sent:', tx.hash);
      
      const receipt = await tx.wait();
      console.log('Transaction confirmed:', receipt.hash);
      
      return receipt.hash;
    } catch (error) {
      console.error('Failed to post message to contract:', error);
      throw error;
    }
  }

  async getGroupPublicKey(): Promise<string> {
    if (!this.contract) {
      throw new Error('Contract not connected');
    }

    const pubKey = await this.contract.groupSigningPubKey();
    return ethers.hexlify(pubKey);
  }

  async getMessageEvents(fromBlock: number = 0): Promise<ContractMessage[]> {
    if (!this.contract) {
      throw new Error('Contract not connected');
    }

    const filter = this.contract.filters.MessagePosted();
    const events = await this.contract.queryFilter(filter, fromBlock);

    return events.map(event => ({
      ciphertext: ethers.hexlify(event.args.ciphertext),
      signature: ethers.hexlify(event.args.signature),
      timestamp: Number(event.args.timestamp),
      sender: event.args.sender,
      transactionHash: event.transactionHash
    }));
  }

  async switchToPassetChain(): Promise<void> {
    if (!this.provider) {
      throw new Error('Provider not connected');
    }

    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: `0x${this.chainId.toString(16)}` }],
      });
    } catch (switchError: any) {
      // Chain not added, try to add it
      if (switchError.code === 4902) {
        await window.ethereum.request({
          method: 'wallet_addEthereumChain',
          params: [{
            chainId: `0x${this.chainId.toString(16)}`,
            chainName: 'Passet Network',
            rpcUrls: [process.env.PASSET_RPC_URL || 'https://rpc.passet.network'],
            nativeCurrency: {
              name: 'Passet',
              symbol: 'PST',
              decimals: 18
            }
          }]
        });
      } else {
        throw switchError;
      }
    }
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