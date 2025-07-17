require("@nomicfoundation/hardhat-toolbox");

// Fix for ESM compatibility issue
const { Buffer } = require('buffer');
if (typeof globalThis.Buffer === 'undefined') {
  globalThis.Buffer = Buffer;
}

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: {
    version: "0.8.19",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200
      }
    }
  },
  networks: {
    passet: {
      url: process.env.PASSET_RPC_URL,
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
      chainId: 88888, // Passet testnet chain ID
      gasPrice: 1000000000, // 1 gwei
      gas: 5000000
    },
    localhost: {
      url: "http://127.0.0.1:8545"
    }
  },
  etherscan: {
    apiKey: {
      passet: process.env.PASSET_API_KEY || ""
    },
    customChains: [
      {
        network: "passet",
        chainId: 1234,
        urls: {
          apiURL: "https://api.passet.network/api",
          browserURL: "https://explorer.passet.network"
        }
      }
    ]
  }
};