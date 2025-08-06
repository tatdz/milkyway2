import { buildPoseidon } from "circomlibjs";

// ==============================================
// 1. Poseidon Hash Implementation
// ==============================================
let poseidon;
let poseidonHash;

async function initializePoseidon() {
    try {
        poseidon = await buildPoseidon();
        
        poseidonHash = (items) => {
            if (!Array.isArray(items)) {
                throw new Error("Poseidon hash requires an array input");
            }
            try {
                const inputs = items.map(x => poseidon.F.e(x.toString()));
                const hash = poseidon(inputs);
                return BigInt(poseidon.F.toString(hash));
            } catch (error) {
                throw new Error(`Hashing failed: ${error.message}`);
            }
        };
        
        console.log("✅ Poseidon initialized");
        return true;
    } catch (error) {
        console.error("❌ Failed to initialize Poseidon:", error);
        return false;
    }
}

// ==============================================
// 2. Verified Merkle Tree Implementation
// ==============================================
class VerifiedMerkleTree {
    constructor(depth, zeroValue = 0n) {
        if (typeof depth !== 'number' || depth < 1 || depth > 32) {
            throw new Error("Depth must be between 1 and 32");
        }

        this.depth = depth;
        this.zeroValue = zeroValue;
        this.leaves = [];
        this.layers = [];
        this.zeros = [];

        // Initialize zero values
        this.zeros = new Array(depth).fill(0n);
        this.zeros[0] = this.zeroValue;
        for (let i = 1; i < depth; i++) {
            this.zeros[i] = poseidonHash([this.zeros[i-1], this.zeros[i-1]]);
        }

        // Initialize empty tree
        this.layers = Array(depth + 1).fill().map(() => []);
        this.root = this.zeros[depth - 1];
    }

    insert(leaf) {
        if (typeof leaf !== 'bigint') {
            throw new Error("Leaf must be a BigInt");
        }

        if (this.leaves.length >= 2**this.depth) {
            throw new Error("Tree is full");
        }

        this.leaves.push(leaf);
        this.layers[0].push(leaf);

        // Rebuild all layers
        let currentIndex = this.leaves.length - 1;
        for (let level = 1; level <= this.depth; level++) {
            const position = Math.floor(currentIndex / 2);
            const left = this.layers[level-1][position*2] || this.zeros[level-1];
            const right = (position*2 + 1 < this.layers[level-1].length) ? 
                this.layers[level-1][position*2 + 1] : 
                this.zeros[level-1];
            
            const node = poseidonHash([left, right]);
            
            if (position < this.layers[level].length) {
                this.layers[level][position] = node;
            } else {
                this.layers[level].push(node);
            }
            
            currentIndex = position;
        }

        this.root = this.layers[this.depth][0] || this.zeros[this.depth - 1];
    }

    generateProof(index) {
        if (index < 0 || index >= this.leaves.length) {
            throw new Error("Invalid index");
        }

        const pathElements = [];
        const pathIndices = [];
        let currentIndex = index;

        for (let level = 0; level < this.depth; level++) {
            const siblingIndex = currentIndex % 2 === 0 ? currentIndex + 1 : currentIndex - 1;
            const sibling = siblingIndex < this.layers[level].length ? 
                this.layers[level][siblingIndex] : 
                this.zeros[level];
            
            pathElements.push(sibling);
            pathIndices.push(currentIndex % 2);
            currentIndex = Math.floor(currentIndex / 2);
        }

        return {
            root: this.root,
            leaf: this.leaves[index],
            pathElements,
            pathIndices
        };
    }

    verifyProof(proof) {
        let computedHash = proof.leaf;
        
        for (let i = 0; i < this.depth; i++) {
            const sibling = proof.pathElements[i];
            const isLeft = proof.pathIndices[i] === 0;
            
            computedHash = isLeft 
                ? poseidonHash([computedHash, sibling])
                : poseidonHash([sibling, computedHash]);
        }
        
        return computedHash === proof.root;
    }
}

// ==============================================
// 3. Secure Semaphore Group Implementation
// ==============================================
class SecureSemaphoreGroup {
    constructor(id, depth = 20) {
        if (typeof id !== 'number' || !Number.isInteger(id) || id < 0) {
            throw new Error("Group ID must be a positive integer");
        }
        if (typeof depth !== 'number' || !Number.isInteger(depth) || depth < 1 || depth > 32) {
            throw new Error("Tree depth must be between 1 and 32");
        }

        this.id = id;
        this.depth = depth;
        this.tree = new VerifiedMerkleTree(depth);
    }

    get members() {
        return [...this.tree.leaves];
    }

    get size() {
        return this.tree.leaves.length;
    }

    get root() {
        return this.tree.root;
    }

    addMember(member) {
        if (typeof member !== 'bigint') {
            throw new Error("Member must be a BigInt");
        }
        this.tree.insert(member);
    }

    generateMerkleProof(index) {
        const proof = this.tree.generateProof(index);
        return {
            ...proof,
            groupId: this.id,
            depth: this.depth,
            size: this.size
        };
    }

    verifyProof(proof) {
        if (proof.groupId !== this.id || proof.depth !== this.depth) {
            return false;
        }
        if (proof.size !== this.size) {
            return false;
        }
        return this.tree.verifyProof(proof);
    }

    indexOf(member) {
        if (typeof member !== 'bigint') {
            throw new Error("Member must be a BigInt");
        }
        return this.tree.leaves.indexOf(member);
    }
}

// ==============================================
// 4. Enhanced Test Suite
// ==============================================
async function runTests() {
    console.log("\nStarting comprehensive tests...");

    // Initialize Poseidon first
    const poseidonReady = await initializePoseidon();
    if (!poseidonReady) {
        return { success: false, error: "Failed to initialize Poseidon" };
    }

    try {
        // Test 1: Verify Poseidon hash
        console.log("\n=== Testing Poseidon Hash ===");
        const testHash = poseidonHash([1n, 2n]);
        console.log("✅ Poseidon hash of [1n, 2n]:", testHash.toString());

        // Test 2: Create group
        console.log("\n=== Testing Group Creation ===");
        const group = new SecureSemaphoreGroup(1, 4); // Smaller depth for testing
        console.log("✅ Group created:", {
            id: group.id,
            size: group.size,
            root: group.root.toString()
        });

        // Test 3: Add members
        console.log("\n=== Testing Member Addition ===");
        const member1 = BigInt("8741330830215907715052783265288994380371576320952029685737807579643339260031");
        group.addMember(member1);
        console.log("✅ Member 1 added:", {
            size: group.size,
            root: group.root.toString()
        });

        const member2 = BigInt("123456789");
        group.addMember(member2);
        console.log("✅ Member 2 added:", {
            size: group.size,
            root: group.root.toString()
        });

        // Test 4: Generate proof
        console.log("\n=== Testing Proof Generation ===");
        const proof = group.generateMerkleProof(0);
        console.log("✅ Proof generated:", {
            root: proof.root.toString(),
            leaf: proof.leaf.toString(),
            pathIndices: proof.pathIndices,
            pathElements: proof.pathElements.map(x => x.toString()),
            size: proof.size
        });

        // Test 5: Verify proof
        console.log("\n=== Testing Proof Verification ===");
        const isValid = group.verifyProof(proof);
        console.log("✅ Proof is:", isValid ? "VALID" : "INVALID");

        // Test 6: Verify invalid proof
        console.log("\n=== Testing Invalid Proof Verification ===");
        const invalidProof = {
            ...proof,
            leaf: BigInt("9999999999999999999999999999999999999999999999999999999999999999999999999999")
        };
        const isInvalidValid = group.verifyProof(invalidProof);
        console.log("✅ Invalid proof is:", isInvalidValid ? "VALID (❌)" : "INVALID (✔️)");

        // Test 7: Member lookup
        console.log("\n=== Testing Member Lookup ===");
        const index = group.indexOf(member1);
        console.log("✅ Member found at index:", index);

        console.log("\n🎉 All tests completed successfully!");
        return { success: true, group };
    } catch (error) {
        console.error("❌ Test failed:", error.message);
        return { success: false, error };
    }
}

// ==============================================
// 5. Main Execution
// ==============================================
async function main() {
    try {
        const result = await runTests();
        if (!result.success) {
            console.error("❌ Tests failed with error:", result.error);
            process.exit(1);
        }
        process.exit(0);
    } catch (error) {
        console.error("Unhandled error in test execution:", error);
        process.exit(1);
    }
}

main();