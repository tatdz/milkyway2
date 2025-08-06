import { buildPoseidon } from "circomlibjs";

// ========================
// 1. Reuse your Merkle tree implementation
// ========================
class VerifiedMerkleTree {
  constructor(depth, zeroValue = 0n) {
    this.depth = depth;
    this.zeroValue = zeroValue;
    this.leaves = [];
    this.zeros = new Array(depth).fill(0n);
    this.zeros[0] = zeroValue;
    for (let i = 1; i < depth; i++) {
      this.zeros[i] = this.poseidonHash([this.zeros[i-1], this.zeros[i-1]]);
    }
    this.root = this.zeros[depth - 1];
  }

  poseidonHash(items) {
    const inputs = items.map(x => this.poseidon.F.e(x.toString()));
    const hash = this.poseidon(inputs);
    return BigInt(this.poseidon.F.toString(hash));
  }

  insert(leaf) {
    this.leaves.push(leaf);
    this.root = this.calculateRoot(this.leaves);
  }

  calculateRoot(leaves) {
    let layer = leaves.slice();
    for (let level = 0; level < this.depth; level++) {
      const nextLayer = [];
      for (let i = 0; i < layer.length; i += 2) {
        const left = layer[i];
        const right = (i + 1 < layer.length) ? layer[i+1] : this.zeros[level];
        nextLayer.push(this.poseidonHash([left, right]));
      }
      layer = nextLayer;
    }
    return layer[0] || this.zeros[this.depth - 1];
  }
}

// ========================
// 2. SecureSemaphoreGroup (Simplified)
// ========================
class SecureSemaphoreGroup {
  constructor(depth = 20) {
    this.tree = new VerifiedMerkleTree(depth);
  }

  addMember(member) {
    this.tree.insert(BigInt(member));
  }

  get root() {
    return this.tree.root;
  }
}

// ========================
// 3. Main Execution
// ========================
async function main() {
  const poseidon = await buildPoseidon();
  VerifiedMerkleTree.prototype.poseidon = poseidon; // Inject Poseidon

  const group = new SecureSemaphoreGroup(20); // depth = 20
  group.addMember("397338260255721648337439624044829523171880033905820567689549048980874981472");

  console.log("Off-chain group root:", group.root.toString());
}

main().catch(console.error);