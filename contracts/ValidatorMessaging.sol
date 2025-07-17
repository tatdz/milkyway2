// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

/**
 * @title ValidatorMessaging
 * @dev Smart contract for encrypted validator group messaging on Passet chain
 * Messages are encrypted off-chain and stored on-chain until governance unlock
 */
contract ValidatorMessaging {
    
    // Mapping from group ID to unlock status
    mapping(string => bool) public groupUnlocked;
    
    // Mapping from message ID to encrypted message
    mapping(uint256 => EncryptedMessage) public messages;
    
    // Counter for message IDs
    uint256 public messageCounter;
    
    // Governance address that can unlock message groups
    address public governance;
    
    struct EncryptedMessage {
        uint256 id;
        string ciphertext;
        string signature;
        address sender;
        uint256 blockNumber;
        uint256 timestamp;
        string groupKeyId;
        bool isUnlocked;
    }
    
    event MessageSubmitted(
        uint256 indexed messageId,
        address indexed sender,
        string groupKeyId,
        uint256 timestamp,
        uint256 blockNumber
    );
    
    event GroupUnlocked(
        string indexed groupKeyId,
        uint256 timestamp,
        uint256 messageCount
    );
    
    modifier onlyGovernance() {
        require(msg.sender == governance, "Only governance can unlock groups");
        _;
    }
    
    modifier validGroupId(string calldata groupKeyId) {
        require(bytes(groupKeyId).length > 0, "Invalid group ID");
        _;
    }
    
    constructor(address _governance) {
        governance = _governance;
        messageCounter = 0;
    }
    
    /**
     * @dev Submit an encrypted message to a validator group
     * @param ciphertext The AES-256 encrypted message content
     * @param signature Ed25519 signature of the ciphertext
     * @param groupKeyId The group key identifier
     */
    function submitMessage(
        string calldata ciphertext,
        string calldata signature,
        string calldata groupKeyId
    ) external validGroupId(groupKeyId) {
        require(bytes(ciphertext).length > 0, "Empty ciphertext");
        require(bytes(signature).length > 0, "Empty signature");
        
        messageCounter++;
        
        messages[messageCounter] = EncryptedMessage({
            id: messageCounter,
            ciphertext: ciphertext,
            signature: signature,
            sender: msg.sender,
            blockNumber: block.number,
            timestamp: block.timestamp,
            groupKeyId: groupKeyId,
            isUnlocked: groupUnlocked[groupKeyId]
        });
        
        emit MessageSubmitted(
            messageCounter,
            msg.sender,
            groupKeyId,
            block.timestamp,
            block.number
        );
    }
    
    /**
     * @dev Unlock a message group for public decryption (governance only)
     * @param groupKeyId The group to unlock
     */
    function unlockGroup(string calldata groupKeyId) 
        external 
        onlyGovernance 
        validGroupId(groupKeyId) 
    {
        require(!groupUnlocked[groupKeyId], "Group already unlocked");
        
        groupUnlocked[groupKeyId] = true;
        
        // Count messages in this group
        uint256 messageCount = 0;
        for (uint256 i = 1; i <= messageCounter; i++) {
            if (keccak256(bytes(messages[i].groupKeyId)) == keccak256(bytes(groupKeyId))) {
                messages[i].isUnlocked = true;
                messageCount++;
            }
        }
        
        emit GroupUnlocked(groupKeyId, block.timestamp, messageCount);
    }
    
    /**
     * @dev Get message by ID
     * @param messageId The message ID
     * @return The encrypted message struct
     */
    function getMessage(uint256 messageId) external view returns (EncryptedMessage memory) {
        require(messageId > 0 && messageId <= messageCounter, "Invalid message ID");
        return messages[messageId];
    }
    
    /**
     * @dev Get messages for a specific group (returns array of IDs for gas efficiency)
     * @param groupKeyId The group key identifier
     * @param onlyUnlocked Whether to return only unlocked messages
     * @return Array of message IDs
     */
    function getGroupMessages(string calldata groupKeyId, bool onlyUnlocked) 
        external 
        view 
        returns (uint256[] memory) 
    {
        // First pass: count matching messages
        uint256 count = 0;
        for (uint256 i = 1; i <= messageCounter; i++) {
            if (keccak256(bytes(messages[i].groupKeyId)) == keccak256(bytes(groupKeyId))) {
                if (!onlyUnlocked || messages[i].isUnlocked) {
                    count++;
                }
            }
        }
        
        // Second pass: collect message IDs
        uint256[] memory messageIds = new uint256[](count);
        uint256 index = 0;
        for (uint256 i = 1; i <= messageCounter; i++) {
            if (keccak256(bytes(messages[i].groupKeyId)) == keccak256(bytes(groupKeyId))) {
                if (!onlyUnlocked || messages[i].isUnlocked) {
                    messageIds[index] = i;
                    index++;
                }
            }
        }
        
        return messageIds;
    }
    
    /**
     * @dev Check if a group is unlocked
     * @param groupKeyId The group key identifier
     * @return Whether the group is unlocked
     */
    function isGroupUnlocked(string calldata groupKeyId) external view returns (bool) {
        return groupUnlocked[groupKeyId];
    }
    
    /**
     * @dev Get total number of messages
     * @return The current message counter
     */
    function getTotalMessages() external view returns (uint256) {
        return messageCounter;
    }
    
    /**
     * @dev Update governance address (only current governance)
     * @param newGovernance The new governance address
     */
    function updateGovernance(address newGovernance) external onlyGovernance {
        require(newGovernance != address(0), "Invalid governance address");
        governance = newGovernance;
    }
}