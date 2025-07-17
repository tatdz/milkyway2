const { ethers } = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();
  
  console.log("Deploying contracts with the account:", deployer.address);
  console.log("Account balance:", (await deployer.getBalance()).toString());

  // Deploy Semaphore first (or use existing address)
  const semaphoreAddress = process.env.SEMAPHORE_ADDRESS || "0x"; // Replace with actual Semaphore address on Passet
  
  if (!semaphoreAddress || semaphoreAddress === "0x") {
    console.log("Warning: No Semaphore address provided. You need to deploy Semaphore first or use existing deployment.");
    console.log("For now, deploying with a placeholder address. Replace before mainnet deployment.");
  }

  // Deploy zkAttestation contract
  console.log("\nDeploying zkAttestation...");
  const zkAttestation = await ethers.deployContract("zkAttestation", [
    semaphoreAddress || deployer.address // Use deployer as placeholder if no Semaphore
  ]);
  await zkAttestation.waitForDeployment();
  const zkAttestationAddress = await zkAttestation.getAddress();
  console.log("zkAttestation deployed to:", zkAttestationAddress);

  // Deploy EncryptedGroupMessages contract
  console.log("\nDeploying EncryptedGroupMessages...");
  
  // Generate a sample Ed25519 public key (32 bytes)
  // In production, this should be the actual group's Ed25519 public key
  const groupPubKey = "0x" + "a".repeat(64); // 32 bytes in hex
  
  const EncryptedGroupMessages = await ethers.deployContract("EncryptedGroupMessages", [
    groupPubKey
  ]);
  await EncryptedGroupMessages.waitForDeployment();
  const encryptedMessagesAddress = await EncryptedGroupMessages.getAddress();
  console.log("EncryptedGroupMessages deployed to:", encryptedMessagesAddress);

  // Save deployment addresses
  const deploymentInfo = {
    network: hre.network.name,
    zkAttestation: zkAttestationAddress,
    encryptedGroupMessages: encryptedMessagesAddress,
    semaphore: semaphoreAddress,
    deployer: deployer.address,
    timestamp: new Date().toISOString(),
    blockNumber: await ethers.provider.getBlockNumber()
  };

  console.log("\n=== Deployment Summary ===");
  console.log(JSON.stringify(deploymentInfo, null, 2));
  
  // Verify contracts if not on localhost
  if (hre.network.name !== "hardhat" && hre.network.name !== "localhost") {
    console.log("\nWaiting for block confirmations...");
    await zkAttestation.deploymentTransaction().wait(6);
    await ValidatorMessaging.deploymentTransaction().wait(6);
    
    try {
      console.log("\nVerifying zkAttestation...");
      await hre.run("verify:verify", {
        address: zkAttestationAddress,
        constructorArguments: [semaphoreAddress || deployer.address],
      });
      
      console.log("Verifying EncryptedGroupMessages...");
      await hre.run("verify:verify", {
        address: encryptedMessagesAddress,
        constructorArguments: [groupPubKey],
      });
    } catch (error) {
      console.log("Verification failed:", error.message);
    }
  }

  return deploymentInfo;
}

main()
  .then((deploymentInfo) => {
    console.log("\n✅ Deployment completed successfully!");
    console.log("Save these addresses for your frontend configuration:");
    console.log(`zkAttestation: ${deploymentInfo.zkAttestation}`);
    console.log(`EncryptedGroupMessages: ${deploymentInfo.encryptedGroupMessages}`);
    process.exit(0);
  })
  .catch((error) => {
    console.error("❌ Deployment failed:", error);
    process.exit(1);
  });