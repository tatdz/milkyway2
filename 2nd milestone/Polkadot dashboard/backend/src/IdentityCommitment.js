const { randomBytes, keccak256, AbiCoder } = require("ethers");

// Generate a random BigInt (31 bytes)
function randomBigInt() {
  const bytes = randomBytes(31);
  const hexString = Buffer.from(bytes).toString("hex");
  return BigInt("0x" + hexString);
}

// Compute identity commitment as keccak256 hash of encoded trapdoor and nullifier, then right shifted 8 bits
function computeIdentityCommitment(trapdoor, nullifier) {
  const abiCoder = new AbiCoder();

  const abiEncoded = abiCoder.encode(
    ["uint256", "uint256"],
    [trapdoor.toString(), nullifier.toString()]
  );

  const hash = keccak256(abiEncoded);
  let hashBigInt = BigInt(hash);
  return hashBigInt >> 8n; // right shift 8 bits
}

function main() {
  const trapdoor = randomBigInt();
  const nullifier = randomBigInt();
  const commitment = computeIdentityCommitment(trapdoor, nullifier);

  console.log("Trapdoor:", trapdoor.toString());
  console.log("Nullifier:", nullifier.toString());
  console.log("Identity Commitment:", commitment.toString());
}

main();
