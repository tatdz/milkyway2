require("@nomicfoundation/hardhat-toolbox");

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
      url: process.env.PASSET_RPC_URL || "https://rpc.passet.network",
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
      chainId: 1234, // Replace with actual Passet chain ID
      gasPrice: 20000000000, // 20 gwei
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