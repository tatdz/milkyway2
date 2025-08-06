// src/api/contract.ts

// Address of the deployed ValidatorAttestation contract
export const attestationContractAddress = '0xYourDeployedContractAddress';

// ABI (Application Binary Interface) including function and event definitions
export const attestationContractAbi = [
  // Function: attest(uint256 validatorId, bytes32 nullifier)
  {
    inputs: [
      { internalType: 'uint256', name: 'validatorId', type: 'uint256' },
      { internalType: 'bytes32', name: 'nullifier', type: 'bytes32' }
    ],
    name: 'attest',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  // Function: isNullifierUsed(bytes32 nullifier) view returns (bool)
  {
    inputs: [{ internalType: 'bytes32', name: 'nullifier', type: 'bytes32' }],
    name: 'isNullifierUsed',
    outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
    stateMutability: 'view',
    type: 'function'
  },
  // Event emitted on successful attestation
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: 'uint256', name: 'validatorId', type: 'uint256' },
      { indexed: true, internalType: 'bytes32', name: 'nullifier', type: 'bytes32' }
    ],
    name: 'Attested',
    type: 'event'
  }
];
