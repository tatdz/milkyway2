import { ethers } from "ethers";

async function debugRevert() {
  const provider = new ethers.providers.JsonRpcProvider(process.env.TESTNET_RPC_URL);
  const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

  const contractAddress = "0x5612f198261ef453122353528a588cd329df853e";

  const abi = [
    "function attest(tuple(uint256[8] proof, uint256 root, uint256 nullifier, uint256 signal, uint256 externalNullifier, uint256 message) proof) external"
  ];

  const contract = new ethers.Contract(contractAddress, abi, wallet);

  const proof = {
    proof: [ /* your 8 uint256 zk proof values */ ],
    root: BigInt("395348979378648357232941232137303751163062503315075942034816323861050695446"),
    nullifier: BigInt("8741330830215907715052783265288994380371576320952029685737807579643339260031"),
    signal: BigInt(yourSignalValue),               // replace with your actual signal uint256
    externalNullifier: BigInt(yourExtNullifier),  // replace with your external nullifier
    message: BigInt(yourValidatorId)               // replace with your validatorId (message)
  };

  try {
    await contract.callStatic.attest(proof);
    console.log("Proof simulation passed");
  } catch (error) {
    console.error("Call reverted with reason:", error.reason || error);
  }
}

debugRevert();
