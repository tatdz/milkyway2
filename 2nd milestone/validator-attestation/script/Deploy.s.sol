// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import { Script } from "forge-std/Script.sol";
import { SemaphoreVerifier } from "@semaphore-protocol/contracts/base/SemaphoreVerifier.sol";
import "@semaphore-protocol/contracts/Semaphore.sol";
import { ValidatorAttestation } from "../src/ValidatorAttestation.sol";
import { ISemaphoreVerifier } from "@semaphore-protocol/contracts/interfaces/ISemaphoreVerifier.sol";

contract DeployScript is Script {
    function run() external {
        // Get deployer private key and address
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        address deployer = vm.addr(deployerPrivateKey);

        vm.startBroadcast(deployerPrivateKey);

        // Deploy SemaphoreVerifier contract (no constructor args)
        SemaphoreVerifier verifier = new SemaphoreVerifier();

        // Deploy Semaphore passing the verifier address (constructor requires ISemaphoreVerifier)
        Semaphore semaphore = new Semaphore(ISemaphoreVerifier(address(verifier)));

        // Deploy ValidatorAttestation passing Semaphore address, groupId=1, and owner address
        ValidatorAttestation attestation = new ValidatorAttestation(
            address(semaphore),
            1,
            deployer
        );

        vm.stopBroadcast();

        // Save deployed contract addresses to .env file
        string memory env = string.concat(
            "SEMAPHORE_ADDRESS=", vm.toString(address(semaphore)), "\n",
            "ATTESTATION_ADDRESS=", vm.toString(address(attestation)), "\n"
        );
        vm.writeFile("out/.env", env);

    }
}
