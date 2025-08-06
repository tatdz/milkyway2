pragma circom 2.0.0;
include "../../node_modules/circomlib/circuits/poseidon.circom";
template Semaphore() {
    signal input identityNullifier;
    signal input identityTrapdoor;
    signal input treePathIndices;
    signal input treeSiblings;
    signal input externalNullifier;
    signal input signalHash;
    component poseidon = Poseidon(2);
    poseidon.inputs[0] <== identityNullifier;
    poseidon.inputs[1] <== identityTrapdoor;
}
component main = Semaphore();