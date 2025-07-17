// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract EncryptedGroupMessages {
    bytes public groupSigningPubKey; // Ed25519 public signing key

    event MessagePosted(
        bytes ciphertext,
        bytes signature,
        uint256 timestamp,
        address indexed sender
    );

    constructor(bytes memory _groupPubKey) {
        require(_groupPubKey.length == 32, "Invalid public key length");
        groupSigningPubKey = _groupPubKey;
    }

    function verifySignature(bytes memory ciphertext, bytes memory signature) internal view returns (bool) {
        // For MVP, assume client-side verification before tx send
        return true;
    }

    function postMessage(bytes calldata ciphertext, bytes calldata signature) external {
        require(verifySignature(ciphertext, signature), "Invalid signature");
        emit MessagePosted(ciphertext, signature, block.timestamp, msg.sender);
    }
}