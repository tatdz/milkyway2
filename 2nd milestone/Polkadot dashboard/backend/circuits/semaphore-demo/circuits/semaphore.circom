pragma circom 2.0.0;

include "node_modules/circomlib/circuits/poseidon.circom";

template Semaphore() {
    signal input identityNullifier;
    signal input identityTrapdoor;
    signal input externalNullifier;
    
    component poseidon = Poseidon(3);
    poseidon.inputs[0] <== identityNullifier;
    poseidon.inputs[1] <== identityTrapdoor;
    poseidon.inputs[2] <== externalNullifier;
    signal output nullifierHash <== poseidon.out;
}

component main = Semaphore();
