// SPDX-License-Identifier: MIT
pragma solidity ^0.8.23;

import { ISemaphore } from "@semaphore-protocol/contracts/interfaces/ISemaphore.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/// @title ValidatorAttestation
/// @notice Validates Semaphore zero-knowledge proofs and tracks attestations by validators
contract ValidatorAttestation is Ownable {
    ISemaphore public semaphore;
    uint256 public groupId;

    /// @notice Tracks used nullifiers to prevent double spends
    mapping(uint256 => bool) public nullifiers;

    /// @notice Tracks how many attestations each validator ID has
    mapping(uint256 => uint256) public validatorAttestationCounts;

    /// @notice Emitted when a validator successfully attests
    event Attested(uint256 indexed validatorId, uint256 indexed nullifier);

    /// @param _semaphore Address of deployed Semaphore contract
    /// @param _groupId Group ID to validate proofs against
    /// @param initialOwner Contract owner, passed to Ownable constructor
    constructor(address _semaphore, uint256 _groupId, address initialOwner) Ownable(initialOwner) {
        semaphore = ISemaphore(_semaphore);
        groupId = _groupId;
    }

    /// @notice Submit a Semaphore zero-knowledge proof as attestation
    /// @param proof SemaphoreProof struct defined in ISemaphore interface
    function attest(ISemaphore.SemaphoreProof calldata proof) external {
        require(!nullifiers[proof.nullifier], "Nullifier already used");

        // Copy from calldata to memory for external contract call
        ISemaphore.SemaphoreProof memory proofMem = proof;

        // Verify the Semaphore zero-knowledge proof for given groupId
        semaphore.verifyProof(groupId, proofMem);

        // Mark nullifier as used to prevent double spending
        nullifiers[proof.nullifier] = true;

        // Increment attestation count using proof.message as validator ID
        validatorAttestationCounts[proof.message]++;

        emit Attested(proof.message, proof.nullifier);
    }

    /// @notice Update the Semaphore contract address (admin only)
    /// @param _semaphore New Semaphore contract address
    function updateSemaphore(address _semaphore) external onlyOwner {
        semaphore = ISemaphore(_semaphore);
    }

    /// @notice Update the Semaphore group ID for proof validation (admin only)
    /// @param _groupId New group ID
    function updateGroup(uint256 _groupId) external onlyOwner {
        groupId = _groupId;
    }
}
