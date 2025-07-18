// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@semaphore-protocol/contracts/interfaces/ISemaphore.sol";

/**
 * @title zkAttestation
 * @dev Smart contract for anonymous validator incident reporting using Semaphore ZK proofs
 * Deployed on Passet chain for Milkyway2 decentralized validator risk reporting
 */
contract zkAttestation {
    ISemaphore public immutable semaphore;
    
    // Group ID for validator attestations
    uint256 public constant VALIDATOR_GROUP_ID = 1;
    
    // Mapping to track used nullifiers (prevents double reporting)
    mapping(uint256 => bool) public nullifierUsed;
    
    // Mapping to track report submissions
    mapping(bytes32 => Report) public reports;
    
    // Counter for report IDs
    uint256 public reportCounter;
    
    struct Report {
        uint256 id;
        bytes32 reportHash;
        uint256 timestamp;
        uint256 nullifierHash;
        string validatorAddress;
        uint8 severity; // 1=low, 2=medium, 3=high, 4=critical
        bool verified;
    }
    
    event ReportSubmitted(
        uint256 indexed reportId,
        bytes32 indexed reportHash,
        uint256 nullifierHash,
        string validatorAddress,
        uint8 severity,
        uint256 timestamp
    );
    
    event ReportVerified(uint256 indexed reportId, bool verified);
    
    modifier onlyValidNullifier(uint256 nullifierHash) {
        require(!nullifierUsed[nullifierHash], "Nullifier already used");
        _;
    }
    
    constructor(address _semaphore) {
        semaphore = ISemaphore(_semaphore);
        reportCounter = 0;
    }
    
    /**
     * @dev Submit an anonymous incident report with ZK proof
     * @param reportHash Hash of the encrypted report data
     * @param nullifierHash Unique nullifier to prevent double reporting
     * @param proof Semaphore ZK proof
     * @param validatorAddress Address of the validator being reported
     * @param severity Severity level of the incident (1-4)
     */
    function submitReport(
        bytes32 reportHash,
        uint256 nullifierHash,
        uint256[8] calldata proof,
        string calldata validatorAddress,
        uint8 severity
    ) external onlyValidNullifier(nullifierHash) {
        require(severity >= 1 && severity <= 4, "Invalid severity level");
        
        // Verify the ZK proof
        semaphore.verifyProof(
            VALIDATOR_GROUP_ID,
            abi.encodePacked(reportHash).toSignal(),
            nullifierHash,
            proof
        );
        
        // Mark nullifier as used
        nullifierUsed[nullifierHash] = true;
        
        // Create new report
        reportCounter++;
        bytes32 reportKey = keccak256(abi.encodePacked(reportCounter, nullifierHash));
        
        reports[reportKey] = Report({
            id: reportCounter,
            reportHash: reportHash,
            timestamp: block.timestamp,
            nullifierHash: nullifierHash,
            validatorAddress: validatorAddress,
            severity: severity,
            verified: false
        });
        
        emit ReportSubmitted(
            reportCounter,
            reportHash,
            nullifierHash,
            validatorAddress,
            severity,
            block.timestamp
        );
    }
    
    /**
     * @dev Verify a submitted report (can be called by governance or validators)
     * @param reportKey The key identifying the report
     * @param verified Whether the report is verified as accurate
     */
    function verifyReport(bytes32 reportKey, bool verified) external {
        require(reports[reportKey].id != 0, "Report does not exist");
        
        reports[reportKey].verified = verified;
        
        emit ReportVerified(reports[reportKey].id, verified);
    }
    
    /**
     * @dev Get report details by key
     * @param reportKey The key identifying the report
     * @return The report struct
     */
    function getReport(bytes32 reportKey) external view returns (Report memory) {
        return reports[reportKey];
    }
    
    /**
     * @dev Check if a nullifier has been used
     * @param nullifierHash The nullifier to check
     * @return Whether the nullifier has been used
     */
    function isNullifierUsed(uint256 nullifierHash) external view returns (bool) {
        return nullifierUsed[nullifierHash];
    }
    
    /**
     * @dev Get the total number of reports submitted
     * @return The current report counter
     */
    function getTotalReports() external view returns (uint256) {
        return reportCounter;
    }
}

// Helper library for signal conversion
library SignalLib {
    function toSignal(bytes memory data) internal pure returns (uint256) {
        return uint256(keccak256(data)) >> 8;
    }
}

extension SignalLib for bytes {
    function toSignal() internal pure returns (uint256) {
        return SignalLib.toSignal(this);
    }
}