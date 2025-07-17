const { ethers } = require("ethers");
const { decodeAddress, encodeAddress } = require("@polkadot/util-crypto");
const { u8aToHex } = require("@polkadot/util");

// Convert Substrate address to check if we have the right key
function analyzeAddress() {
  const substrateAddress = "5D5d1d6uiscBuzLp6UuYEuZmyt6ciAhbfQq3oeA4dhFJaqTV";
  
  try {
    // Decode the substrate address to get the public key
    const decoded = decodeAddress(substrateAddress);
    const publicKeyHex = u8aToHex(decoded);
    
    console.log("Substrate address:", substrateAddress);
    console.log("Public key (hex):", publicKeyHex);
    
    // Check current private key
    if (process.env.PRIVATE_KEY) {
      const wallet = new ethers.Wallet(process.env.PRIVATE_KEY);
      console.log("Current Ethereum address:", wallet.address);
      console.log("Current private key starts with:", process.env.PRIVATE_KEY.substring(0, 10) + "...");
      
      // Try to see if we can derive substrate address from current key
      // Note: This is a simplified check - actual derivation is more complex
      console.log("Note: Substrate and Ethereum use different key derivation methods");
    }
    
  } catch (error) {
    console.error("Address analysis failed:", error.message);
  }
}

analyzeAddress();