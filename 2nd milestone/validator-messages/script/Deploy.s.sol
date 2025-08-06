// SPDX-License-Identifier: MIT
pragma solidity ^0.8.23;

import "forge-std/Script.sol";
import "../src/ValidatorMessages.sol";

contract DeployValidatorMessages is Script {
    function run() external {
        vm.startBroadcast();
        ValidatorMessages messages = new ValidatorMessages();
        console.log("ValidatorMessages deployed at:", address(messages));
        vm.stopBroadcast();
    }
}