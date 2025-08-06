// SPDX-License-Identifier: MIT
pragma solidity ^0.8.23;

import "forge-std/Test.sol";
import "../src/ValidatorMessages.sol";

contract ValidatorMessagesTest is Test {
    ValidatorMessages public validatorMessages;

    function setUp() public {
        validatorMessages = new ValidatorMessages();
    }

    function testInitialMessages() public view {
        ValidatorMessages.Message[] memory messages = validatorMessages.getAllMessages();
        
        // Check the exact expected values that match the constructor
        assertEq(messages.length, 2, "Should have 2 initial messages");
        assertEq(messages[0].content, "Test message 1", "First message content should match");
        assertEq(messages[1].content, "Test message 2", "Second message content should match");
        
        // Additional checks for completeness
        assertEq(messages[0].validator, address(0x742d), "First validator address should match");
        assertEq(messages[1].validator, address(0x5Fdd), "Second validator address should match");
    }

    function testSubmitMessage() public {
        address testValidator = address(0x123);
        address testNominator = address(0x456);
        string memory testContent = "New test message";
        uint256 testEra = 999;
        bytes32 testTxHash = keccak256("test");

        vm.prank(testNominator);
        validatorMessages.submitMessage(testValidator, testContent, testEra, testTxHash);

        ValidatorMessages.Message[] memory messages = validatorMessages.getMessagesByNominator(testNominator);
        assertEq(messages.length, 1, "Should have 1 message for this nominator");
        assertEq(messages[0].content, testContent, "Message content should match");
    }
}