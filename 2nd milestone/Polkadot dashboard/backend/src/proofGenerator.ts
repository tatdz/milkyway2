// src/proofGenerator.ts
import { Identity } from '@semaphore-protocol/identity';
import { Group } from '@semaphore-protocol/group';
import { generateProof } from '@semaphore-protocol/proof';
import { ethers } from 'ethers';

// Configuration constants
const CONFIG = {
  SEMAPHORE: {
    GROUP_ID: 1,
    EXTERNAL_NULLIFIER: 'polkadot-validator-attestation',
    TREE_DEPTH: 20,
    CIRCUIT_ID: 'credentialAtomicQuerySig', // Optional fallback scope
  },
};

// Local type def (the proof shape returned by your generateProof)
interface SemaphoreProof {
  merkleTreeDepth: number;
  merkleTreeRoot: bigint;
  nullifier: bigint;
  message: bigint;
  scope: bigint;
  points: string[];
}

// Helper to serialize BigInt and proof points for readable logging, etc.
function serializeProof(proof: any): SemaphoreProof & { [key: string]: any } {
  return {
    ...proof,
    merkleTreeRoot: BigInt(proof.merkleTreeRoot),
    nullifier: BigInt(proof.nullifier),
    message: BigInt(proof.message),
    scope: BigInt(proof.scope || CONFIG.SEMAPHORE.CIRCUIT_ID),
    points: proof.points ? proof.points.map((p: any) => p.toString()) : [],
  };
}

function debugProof(rawProof: any) {
  console.log('\n🔍 Proof Structure Debug:');
  console.log('- Type:', typeof rawProof);
  console.log('- Available Keys:', Object.keys(rawProof));
  if (rawProof) {
    console.log('- merkleTreeDepth:', typeof rawProof.merkleTreeDepth);
    console.log('- merkleTreeRoot:', typeof rawProof.merkleTreeRoot);
    console.log('- nullifier:', typeof rawProof.nullifier);
    console.log('- message:', typeof rawProof.message);
    console.log('- points:', Array.isArray(rawProof.points) ? rawProof.points.length : 'N/A');
  }
}

function validateProof(rawProof: any): SemaphoreProof {
  debugProof(rawProof);

  if (!rawProof) {
    throw new Error('Proof generation returned undefined');
  }

  // Normalize data types
  const proof: SemaphoreProof = {
    merkleTreeDepth: Number(rawProof.merkleTreeDepth),
    merkleTreeRoot: BigInt(rawProof.merkleTreeRoot),
    nullifier: BigInt(rawProof.nullifier),
    message: BigInt(rawProof.message),
    scope: BigInt(rawProof.scope || CONFIG.SEMAPHORE.CIRCUIT_ID),
    points: rawProof.points ? rawProof.points.map((p: any) => p.toString()) : [],
  };

  if (!proof.merkleTreeRoot || !proof.nullifier) {
    throw new Error(`Invalid proof structure: ${JSON.stringify(serializeProof(proof), null, 2)}`);
  }
  return proof;
}

// Keep old cast call formatter using stringified points
function formatCastCommand(proof: SemaphoreProof, validatorId: bigint) {
  const pointsStr = proof.points.join(',');

  console.log('\n🎉 Ready-to-run cast command:\n');
  console.log(
    `cast call 0x5612F198261eF453122353528a588cD329DF853e "attest(uint256,uint256,uint256,string)" ` +
    `'${validatorId}', '${proof.nullifier}', '${proof.scope}', '${pointsStr}' --rpc-url $TESTNET_RPC_URL`
  );
}

// FIXED: new cast send command generator matching your proof shape
function generateCastSendCommand(proof: SemaphoreProof, validatorId: number) {
  const pointsStr = proof.points.join(',');

  const tupleArg = `(${validatorId}, ${proof.nullifier}, ${proof.scope}, '${pointsStr}')`;

  console.log('\n💡 Copy & run this `cast send` command:\n');
  console.log(`cast send 0x5612F198261eF453122353528a588cD329DF853e \\`);
  console.log(`"attest(uint256,uint256,uint256,string)" \\`);
  console.log(`'${tupleArg}' \\`);
  console.log(`--rpc-url $TESTNET_RPC_URL --private-key $PRIVATE_KEY`);
}

// Main proof generation workflow
async function generateValidatorProof(validatorId: number) {
  try {
    console.log('\n=== Starting Proof Generation ===');

    const identity = new Identity();
    console.log('✅ Identity created');
    console.log(`   Commitment: ${identity.commitment.toString()}`);

    const group = new Group();
    group.addMember(identity.commitment);
    console.log('✅ Group configured');
    console.log(`   Root: ${group.root.toString()}`);
    console.log(`   Depth: ${group.depth}`);

    const externalNullifier = ethers.keccak256(ethers.toUtf8Bytes(CONFIG.SEMAPHORE.EXTERNAL_NULLIFIER));
    console.log('✅ External nullifier created');
    console.log(`   Hash: ${externalNullifier}`);

    console.log('\n⚙️ Generating proof...');
    const rawProof = await generateProof(
      identity,
      group,
      externalNullifier,
      validatorId.toString(),
      CONFIG.SEMAPHORE.TREE_DEPTH
    );

    console.log('🔍 Raw proof output:', rawProof);

    const proof = validateProof(rawProof);
    console.log('✅ Proof validated');

    console.log('\n=== Proof Generation Successful ===');
    console.log('Validator ID:', validatorId);
    console.log('Nullifier:', proof.nullifier.toString());
    console.log('Merkle Root:', proof.merkleTreeRoot.toString());
    console.log('Proof Points Count:', proof.points.length);

    formatCastCommand(proof, BigInt(validatorId));
    generateCastSendCommand(proof, validatorId);

    return {
      validatorId,
      nullifier: proof.nullifier.toString(),
      merkleRoot: proof.merkleTreeRoot.toString(),
      proofData: serializeProof(proof),
    };
  } catch (error) {
    console.error('\n❌ Proof generation failed:');
    if (error instanceof Error) {
      console.error(error.message);
      if (error.stack) console.error('Stack trace:\n' + error.stack.split('\n').slice(0, 3).join('\n'));
    }
    throw error;
  }
}

// Entrypoint
async function main() {
  try {
    const validatorId = 1;
    const result = await generateValidatorProof(validatorId);
    console.log('\nProcess completed successfully.');
    return result;
  } catch (error) {
    console.error('\n⚠️ Fatal error in main process:');
    console.error(error instanceof Error ? error.message : error);
    process.exit(1);
  }
}

main().catch(console.error);
