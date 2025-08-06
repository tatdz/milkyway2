import { ethers } from "ethers";

async function getMembers(groupId, providerUrl, semaphoreAddress, fromBlockOverride, toBlockOverride) {
  const provider = new ethers.JsonRpcProvider(providerUrl);

  const semaphoreAbi = [
    "event MemberAdded(uint256 indexed groupId, uint256 index, uint256 identityCommitment, uint256 merkleTreeRoot)"
  ];

  const semaphoreContract = new ethers.Contract(semaphoreAddress, semaphoreAbi, provider);

  const latestBlockOnChain = await provider.getBlockNumber();

  const fromBlock = fromBlockOverride || 0;
  const toBlockLimit = toBlockOverride || latestBlockOnChain;
  const latestBlock = Math.min(latestBlockOnChain, toBlockLimit);

  const chunkSize = 499;
  let allEvents = [];

  for (let start = fromBlock; start <= latestBlock; start += chunkSize + 1) {
    const endBlock = Math.min(start + chunkSize, latestBlock);
    console.log(`Fetching logs for blocks ${start} to ${endBlock}...`);

    try {
      const filter = semaphoreContract.filters.MemberAdded(groupId, null, null, null);
      const events = await semaphoreContract.queryFilter(filter, start, endBlock);
      allEvents = allEvents.concat(events);
    } catch (err) {
      console.error(`Error fetching logs for blocks ${start}-${endBlock}:`, err);
      throw err;
    }
  }

  const members = allEvents.map(event => event.args.identityCommitment.toString());

  return members;
}

async function main() {
  try {
    const GROUP_ID = 1;
    const PROVIDER_URL = process.env.TESTNET_RPC_URL || "https://eth-sepolia.g.alchemy.com/v2/your-api-key";
    const SEMAPHORE_CONTRACT_ADDRESS = "0x462Acb157da388648434924E05Ce83AF74dEE057";

    // TODO: Replace with your actual deployment block number or recent block to speed up fetching
    const DEPLOYMENT_BLOCK = 1234567; 

    // For testing, limit block range to scan:
    const MAX_BLOCKS_TO_FETCH = 5000;

    const members = await getMembers(
      GROUP_ID,
      PROVIDER_URL,
      SEMAPHORE_CONTRACT_ADDRESS,
      DEPLOYMENT_BLOCK,
      DEPLOYMENT_BLOCK + MAX_BLOCKS_TO_FETCH
    );

    console.log(`Fetched ${members.length} member(s) for group ${GROUP_ID}:`);
    console.log(members);
  } catch (error) {
    console.error("Failed to fetch members:", error);
  }
}

main();
