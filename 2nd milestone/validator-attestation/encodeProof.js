import { ethers } from "ethers";
import fs from "fs/promises";

async function encode() {
  try {
    // Read and parse the proof JSON file
    const data = await fs.readFile("proof.json", "utf8");
    let proof = JSON.parse(data);

    // If proof is an array (e.g. [ {...} ]), extract first object
    if (Array.isArray(proof)) {
      proof = proof[0];
    }

    const abi = [
      "function attest(tuple(uint256[8] proof, uint256 root, uint256 nullifier, uint256 signal, uint256 externalNullifier, uint256 message) proof) external"
    ];

    const iface = new ethers.Interface(abi);

    // Encode function data: pass the proof object as the single argument in array
    const calldata = iface.encodeFunctionData("attest", [proof]);

    console.log("Encoded calldata:", calldata);
  } catch (error) {
    console.error("Error encoding calldata:", error);
  }
}

encode();
