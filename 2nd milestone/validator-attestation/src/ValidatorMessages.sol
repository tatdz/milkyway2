// SPDX-License-Identifier: MIT
pragma solidity ^0.8.23;

contract ValidatorMessages {
    // Struct to store message data
    struct Message {
        address validator;
        address nominator;
        string content;
        uint256 era;
        bytes32 txHash;
    }
    
    // Storage variables
    Message[] public allMessages;
    mapping(address => Message[]) public validatorToMessages;
    mapping(address => Message[]) public nominatorToMessages;

    // Events
    event MessageSubmitted(
        address indexed validator,
        address indexed nominator,
        uint256 indexed era,
        string content,
        bytes32 txHash
    );

    constructor() {
        // Initialize with test data
        _addHardcodedMessage(
            address(0x742d),
            address(0x8bA1),
            "Test message 1",
            12345,
            keccak256("test1")
        );

        _addHardcodedMessage(
            address(0x5Fdd),
            address(0x7e4D),
            "Test message 2",
            45678,
            keccak256("test2")
        );
    }

    // Internal function to add initial messages
    function _addHardcodedMessage(
        address validator,
        address nominator,
        string memory content,
        uint256 era,
        bytes32 txHash
    ) internal {
        Message memory newMsg = Message(validator, nominator, content, era, txHash);
        allMessages.push(newMsg);
        validatorToMessages[validator].push(newMsg);
        nominatorToMessages[nominator].push(newMsg);
    }

    // Submit a new message
    function submitMessage(
        address validator,
        string calldata content,
        uint256 era,
        bytes32 txHash
    ) external {
        require(bytes(content).length <= 256, "Message too long");
        require(bytes(content).length > 0, "Message cannot be empty");
        require(validator != address(0), "Invalid validator address");
        require(txHash != bytes32(0), "Invalid transaction hash");

        Message memory newMsg = Message({
            validator: validator,
            nominator: msg.sender,
            content: content,
            era: era,
            txHash: txHash
        });

        allMessages.push(newMsg);
        validatorToMessages[validator].push(newMsg);
        nominatorToMessages[msg.sender].push(newMsg);

        emit MessageSubmitted(validator, msg.sender, era, content, txHash);
    }

    // Get all messages
    function getAllMessages() external view returns (Message[] memory) {
        return allMessages;
    }

    // Get messages by validator
    function getMessagesByValidator(address validator) external view returns (Message[] memory) {
        require(validator != address(0), "Invalid validator address");
        return validatorToMessages[validator];
    }

    // Get messages by nominator
    function getMessagesByNominator(address nominator) external view returns (Message[] memory) {
        require(nominator != address(0), "Invalid nominator address");
        return nominatorToMessages[nominator];
    }

    // Advanced filtering with pagination
    function getMessages(
        address validatorFilter, 
        address nominatorFilter,
        uint256 offset,
        uint256 limit
    ) external view returns (Message[] memory) {
        require(limit > 0, "Limit must be greater than 0");
        
        if (validatorFilter != address(0) && nominatorFilter != address(0)) {
            return _getIntersectionMessages(validatorFilter, nominatorFilter, offset, limit);
        } else if (validatorFilter != address(0)) {
            return _paginate(validatorToMessages[validatorFilter], offset, limit);
        } else if (nominatorFilter != address(0)) {
            return _paginate(nominatorToMessages[nominatorFilter], offset, limit);
        }
        return _paginate(allMessages, offset, limit);
    }

    // Get total message count
    function getTotalMessageCount() external view returns (uint256) {
        return allMessages.length;
    }

    // Internal function to get intersection of validator and nominator messages
    function _getIntersectionMessages(
        address validator,
        address nominator,
        uint256 offset,
        uint256 limit
    ) internal view returns (Message[] memory) {
        Message[] storage validatorMsgs = validatorToMessages[validator];
        Message[] memory result = new Message[](limit);
        uint256 count = 0;
        
        for (uint256 i = offset; i < validatorMsgs.length && count < limit; i++) {
            if (validatorMsgs[i].nominator == nominator) {
                result[count] = validatorMsgs[i];
                count++;
            }
        }
        
        // Resize array to actual count
        assembly {
            mstore(result, count)
        }
        return result;
    }

    // Internal pagination function
    function _paginate(
        Message[] storage source,
        uint256 offset,
        uint256 limit
    ) internal view returns (Message[] memory) {
        uint256 end = offset + limit;
        if (end > source.length) {
            end = source.length;
        }
        if (offset >= end) {
            return new Message[](0);
        }

        Message[] memory result = new Message[](end - offset);
        for (uint256 i = offset; i < end; i++) {
            result[i - offset] = source[i];
        }
        return result;
    }
}