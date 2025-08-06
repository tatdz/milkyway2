import { Identity } from "@semaphore-protocol/identity";
import { Group } from "@semaphore-protocol/group";
import { generateProof } from "@semaphore-protocol/proof";

const seed = "your secret seed phrase here";
const identity = new Identity(seed);

console.log("Identity commitment:", identity.commitment, typeof identity.commitment);

const merkleTreeDepth = 20;

// Pass an array of commitments (even if only one)
const group = new Group(1, merkleTreeDepth, [identity.commitment]);

const signal = "my-signal";
const externalNullifier = BigInt("123456789");

// paths to circuit files
const wasmFilePath = "./semaphore.wasm";
const zkeyFilePath = "./semaphore.zkey";

(async () => {
  try {
    const fullProof = await generateProof(
      identity,
      group,
      externalNullifier,
      signal,
      { wasmFilePath, zkeyFilePath }
    );
    console.log("Proof generated successfully!");
    console.log(fullProof);
  } catch (e) {
    console.error("Proof generation failed:", e);
  }
})();
