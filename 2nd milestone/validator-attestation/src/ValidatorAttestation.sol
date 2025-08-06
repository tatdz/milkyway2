// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";

contract ValidatorAttestation {
    using ECDSA for bytes32;
    
    address public immutable oracleAddress;
    
    enum RiskLevel { LOW, MEDIUM, HIGH }
    
    struct Validator {
        address id;
        string name;
        uint256 riskScore;
        uint256 commissionRate;
        uint256 uptime;
        bool isActive;
    }
    
    struct Attestation {
        address user;
        address validator;
        RiskLevel riskLevel;
        string comment;
        bytes32 messageHash;
        uint256 timestamp;
    }
    
    // Core mappings
    mapping(address => Validator) public validators;
    mapping(address => Attestation[]) public validatorAttestations;
    mapping(address => Attestation[]) public userAttestations;
    mapping(bytes32 => bool) public usedMessages;
    
    // Events
    event ValidatorRegistered(address indexed validator, string name);
    event AttestationSubmitted(
        address indexed user,
        address indexed validator,
        RiskLevel riskLevel,
        string comment
    );

    constructor(address _oracleAddress) {
        oracleAddress = _oracleAddress;
    }

    // Register validator (callable by oracle only)
    function registerValidator(
        address validatorAddress,
        string memory name,
        uint256 commissionRate
    ) external {
        require(msg.sender == oracleAddress, "Only oracle can register");
        validators[validatorAddress] = Validator({
            id: validatorAddress,
            name: name,
            riskScore: 50, // Default medium risk
            commissionRate: commissionRate,
            uptime: 100, // Default 100% uptime
            isActive: true
        });
        emit ValidatorRegistered(validatorAddress, name);
    }

    // Submit attestation with enhanced data
    function attest(
        address user,
        address validator,
        RiskLevel riskLevel,
        string memory comment,
        bytes calldata signature,
        bytes32 messageHash
    ) external {
        // Verify signature
        bytes32 ethSignedHash = keccak256(
            abi.encodePacked("\x19Ethereum Signed Message:\n32", 
            keccak256(abi.encodePacked(user, validator, riskLevel, comment)))
        ).toEthSignedMessageHash();
        
        require(
            ethSignedHash.recover(signature) == oracleAddress,
            "Invalid oracle signature"
        );
        
        // Prevent replay
        require(!usedMessages[messageHash], "Message already used");
        usedMessages[messageHash] = true;

        // Create attestation
        Attestation memory newAttestation = Attestation({
            user: user,
            validator: validator,
            riskLevel: riskLevel,
            comment: comment,
            messageHash: messageHash,
            timestamp: block.timestamp
        });

        // Update validator risk score (simple average for demo)
        Validator storage v = validators[validator];
        v.riskScore = (v.riskScore + uint256(riskLevel) * 50) / 2;
        
        // Store attestation
        validatorAttestations[validator].push(newAttestation);
        userAttestations[user].push(newAttestation);
        
        emit AttestationSubmitted(user, validator, riskLevel, comment);
    }

    // View functions for dashboard
    function getValidatorDetails(address validator) public view returns (
        string memory name,
        uint256 riskScore,
        uint256 commissionRate,
        uint256 uptime,
        bool isActive,
        uint256 attestationCount
    ) {
        Validator memory v = validators[validator];
        return (
            v.name,
            v.riskScore,
            v.commissionRate,
            v.uptime,
            v.isActive,
            validatorAttestations[validator].length
        );
    }

    function getValidatorAttestations(
        address validator,
        uint256 page,
        uint256 pageSize
    ) public view returns (Attestation[] memory) {
        Attestation[] storage all = validatorAttestations[validator];
        uint256 start = page * pageSize;
        if (start >= all.length) return new Attestation[](0);
        
        uint256 end = start + pageSize > all.length ? all.length : start + pageSize;
        Attestation[] memory pageAttestations = new Attestation[](end - start);
        
        for (uint256 i = start; i < end; i++) {
            pageAttestations[i - start] = all[i];
        }
        
        return pageAttestations;
    }
}