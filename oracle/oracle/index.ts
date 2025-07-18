// Rewritten script to use Ethereum Sepolia as both source and destination (self-bridge)

require("log-timestamp");
import { HyperClient, MessageStatusWithMeta } from "@polytope-labs/hyperclient";
import { config } from "dotenv";
import {
  createPublicClient,
  createWalletClient,
  decodeFunctionData,
  formatEther,
  fromHex,
  getContract,
  http,
  parseAbi,
  parseEventLogs,
  toHex,
  encodePacked,
  decodeAbiParameters,
} from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { sepolia } from "viem/chains";
import { ApiPromise, WsProvider } from "@polkadot/api";

import ERC6160 from "./abis/erc6160";
import PING_MODULE from "./abis/pingModule";
import EVM_HOST from "./abis/evmHost";
import HANDLER from "./abis/handler";
import { createServer } from 'http';
import { handleExampleEndpoint } from './exampleEndpoint';

const PING_MODULE_ADDRESS = "0xFE9f23F0F2fE83b8B9576d3FC94e9a7458DdDD35";

async function testPostAndGetRequest() {
  const {
    ethSrcClient,
    ethFeeToken,
    ETH_SRC,
    ETH_DEST,
    account,
    ethHandler,
    ethPing,
    ethDestHandler,
    ethDestClient,
    ethDestIsmpHost,
  } = await setUp();
  const blockNumber = await ethSrcClient.getBlockNumber();
  console.log("Latest block number: ", blockNumber);

  let balance = await ethFeeToken.read.balanceOf([account.address as any]);
  console.log("FeeToken balance: $", formatEther(balance));

  if (balance === BigInt(0)) {
    console.warn("Token faucet not available. Please fund manually.");
    console.warn("Insufficient balance for address:", account.address);
  }

  const allowance = await ethFeeToken.read.allowance([
    account.address!,
    PING_MODULE_ADDRESS,
  ]);

  if (allowance === BigInt(0)) {
    console.log("Setting allowance .. ");
    const hash = await ethFeeToken.write.approve([
      PING_MODULE_ADDRESS,
      fromHex(
        "0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff",
        "bigint"
      ),
    ]);
    await ethSrcClient.waitForTransactionReceipt({ hash, confirmations: 1 });
  }

  console.log("Setting up hyperclient");

  const HyperbridgeConfig = {
    rpc_url: "wss://hyperbridge-paseo-rpc.blockops.network",
    state_machine: "KUSAMA-4009",
    consensus_state_id: "PAS0",
  };

  const hyperclient = await HyperClient.init({
    source: ETH_SRC,
    dest: ETH_DEST,
    hyperbridge: HyperbridgeConfig,
  });

  const wsProvider = new WsProvider(HyperbridgeConfig.rpc_url);
  const api = await ApiPromise.create({ provider: wsProvider });
  const height = (
    await api.query.ismp.latestStateMachineHeight({
      stateId: { Evm: 11155111 },
      consensusStateId: "ETH0",
    })
  ).toJSON() as number;

  // Encode 'hello' as raw bytes for the first key
  const encodedKey = toHex(new TextEncoder().encode("hello"));
  const txHash = await ethPing.write.dispatch([
    {
      source: "0x",
      dest: ETH_DEST.state_machine,
      nonce: 0n,
      context: "0x",
      from: account.address,
      keys: [
        encodedKey,
        ethDestIsmpHost.address,
        ethDestHandler.address,
      ],
      height: BigInt(height),
      timeoutTimestamp: 0n,
    },
  ]);

  const txReceipt = await ethSrcClient.waitForTransactionReceipt({
    hash: txHash,
    confirmations: 1,
  });

  console.log(`Transaction receipt: https://sepolia.etherscan.io/tx/${txHash}`);
  console.log("Block: ", txReceipt.blockNumber);

  const txEvent = parseEventLogs({ abi: EVM_HOST.ABI, logs: txReceipt.logs })[0];
  if (txEvent.eventName !== "GetRequestEvent") throw new Error("Unexpected Event type");

  const getRequest = { ...txEvent.args };
  // Debug: log the full event args
  console.log("GetRequest event args:", txEvent.args);
  // Decode the first key as raw bytes to string
  const encodedKeyFromEvent = getRequest.keys[0];
  if (encodedKeyFromEvent && encodedKeyFromEvent !== "0x") {
    const decodedKey = Buffer.from(encodedKeyFromEvent.slice(2), "hex").toString();
    console.log("Decoded key from GetRequest:", decodedKey);
  } else {
    console.warn("Key is empty or zero data:", encodedKeyFromEvent);
  }
  // Decode the context field only if not empty
  const encodedContext = getRequest.context;
  if (encodedContext && encodedContext !== "0x") {
    const decodedContext = decodeAbiParameters(
      [{ type: "string" }],
      encodedContext
    )[0];
    console.log("Decoded context from GetRequest:", decodedContext);
  } else {
    console.warn("Context is empty or zero data:", encodedContext);
  }
  console.log("Get request sent successfully. Exiting without waiting for status updates.");
  console.log("Transaction hash:", txHash);
  console.log("Block number:", txReceipt.blockNumber);

  console.log("\n\nSending Post Request\n\n");

  const hash = await ethPing.write.ping([
    {
      dest: await ethDestIsmpHost.read.host(),
      count: BigInt(1),
      fee: BigInt(0),
      module: PING_MODULE_ADDRESS,
      timeout: BigInt(60 * 60),
    },
  ]);

  const receipt = await ethSrcClient.waitForTransactionReceipt({ hash, confirmations: 1 });
  console.log(`Transaction receipt: https://sepolia.etherscan.io/tx/${hash}`);

  const event = parseEventLogs({ abi: EVM_HOST.ABI, logs: receipt.logs })[0];
  if (event.eventName !== "PostRequestEvent") throw new Error("Unexpected Event type");

  const request = event.args;
  const status = await hyperclient.query_post_request_status(request);
  console.log("Request status: ", status);

  const stream = await hyperclient.post_request_status_stream(request, {
    Dispatched: receipt.blockNumber,
  });

  for await (const item of stream) {
    const status: MessageStatusWithMeta =
      item instanceof Map ? Object.fromEntries(item.entries()) : item;
    console.log({ status });

    switch (status.kind) {
      case "HyperbridgeFinalized": {
        console.log(
          `Status ${status.kind}, Transaction: https://sepolia.etherscan.io/tx/${status.transaction_hash}`
        );
        const { args } = decodeFunctionData({
          abi: HANDLER.ABI,
          data: status.calldata,
        });
        try {
          const hash = await ethDestHandler.write.handlePostRequests(args as any);
          await ethDestClient.waitForTransactionReceipt({ hash, confirmations: 1 });
          console.log(`Transaction submitted: https://sepolia.etherscan.io/tx/${hash}`);
        } catch (e) {
          console.error("Error self-relaying: ", e);
        }
        break;
      }
      case "DestinationDelivered": {
        console.log(
          `Status ${status.kind}, Transaction: https://sepolia.etherscan.io/tx/${status.transaction_hash}`
        );
        return;
      }
      case "Timeout":
        return;
    }
  }
}

async function testGetRequest() {
  const {
    ethSrcClient,
    ethFeeToken,
    ETH_SRC,
    ETH_DEST,
    account,
    ethHandler,
    ethPing,
    ethDestHandler,
    ethDestClient,
    ethDestIsmpHost,
    tokenFaucet,
  } = await setUp();
  const blockNumber = await ethSrcClient.getBlockNumber();
  console.log("Latest block number: ", blockNumber);

  let balance = await ethFeeToken.read.balanceOf([account.address as any]);
  console.log("FeeToken balance: $", formatEther(balance));

  if (balance === BigInt(0)) {
    console.warn("Token faucet not available. Please fund manually.");
    console.warn("Insufficient balance for address:", account.address);
  }

  const allowance = await ethFeeToken.read.allowance([
    account.address!,
    PING_MODULE_ADDRESS,
  ]);

  if (allowance === BigInt(0)) {
    console.log("Setting allowance .. ");
    const hash = await ethFeeToken.write.approve([
      PING_MODULE_ADDRESS,
      fromHex(
        "0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff",
        "bigint"
      ),
    ]);
    await ethSrcClient.waitForTransactionReceipt({ hash, confirmations: 1 });
  }

  console.log("Setting up hyperclient");

  const HyperbridgeConfig = {
    rpc_url: "wss://hyperbridge-paseo-rpc.blockops.network",
    state_machine: "KUSAMA-4009",
    consensus_state_id: "PAS0",
  };

  const hyperclient = await HyperClient.init({
    source: ETH_SRC,
    dest: ETH_DEST,
    hyperbridge: HyperbridgeConfig,
  });

  const wsProvider = new WsProvider(HyperbridgeConfig.rpc_url);
  const api = await ApiPromise.create({ provider: wsProvider });
  const height = (
    await api.query.ismp.latestStateMachineHeight({
      stateId: { Evm: 11155111 },
      consensusStateId: "ETH0",
    })
  ).toJSON() as number;

  // Encode 'hello' as raw bytes for the first key
  const encodedKey = toHex(new TextEncoder().encode("hello"));
  const txHash = await ethPing.write.dispatch([
    {
      source: "0x",
      dest: ETH_DEST.state_machine,
      nonce: 0n,
      context: "0x",
      from: account.address,
      keys: [
        encodedKey,
        ethDestIsmpHost.address,
        ethDestHandler.address,
      ],
      height: BigInt(height),
      timeoutTimestamp: 0n,
    },
  ]);

  const txReceipt = await ethSrcClient.waitForTransactionReceipt({
    hash: txHash,
    confirmations: 1,
  });

  console.log(`Transaction receipt: https://sepolia.etherscan.io/tx/${txHash}`);
  console.log("Block: ", txReceipt.blockNumber);

  const txEvent = parseEventLogs({ abi: EVM_HOST.ABI, logs: txReceipt.logs })[0];
  if (txEvent.eventName !== "GetRequestEvent") throw new Error("Unexpected Event type");

  const getRequest = { ...txEvent.args };
  // Debug: log the full event args
  console.log("GetRequest event args:", txEvent.args);
  // Decode the first key as raw bytes to string
  const encodedKeyFromEvent = getRequest.keys[0];
  if (encodedKeyFromEvent && encodedKeyFromEvent !== "0x") {
    const decodedKey = Buffer.from(encodedKeyFromEvent.slice(2), "hex").toString();
    console.log("Decoded key from GetRequest:", decodedKey);
  } else {
    console.warn("Key is empty or zero data:", encodedKeyFromEvent);
  }
  // Decode the context field only if not empty
  const encodedContext = getRequest.context;
  if (encodedContext && encodedContext !== "0x") {
    const decodedContext = decodeAbiParameters(
      [{ type: "string" }],
      encodedContext
    )[0];
    console.log("Decoded context from GetRequest:", decodedContext);
  } else {
    console.warn("Context is empty or zero data:", encodedContext);
  }
  console.log("Status Dispatched");
  console.log(`Transaction submitted: https://sepolia.etherscan.io/tx/${txHash}`);
  console.log(`Status Dispatched, Transaction: https://sepolia.etherscan.io/tx/${txHash}`);
  
  console.log("Dispatch completed - returning immediately");
  process.exit(0);
}

async function sendStringData(message: string) {
  const {
    ethSrcClient,
    ethFeeToken,
    ETH_SRC,
    ETH_DEST,
    account,
    ethHandler,
    ethPing,
    ethDestHandler,
    ethDestClient,
    ethDestIsmpHost,
    tokenFaucet,
  } = await setUp();
  
  const blockNumber = await ethSrcClient.getBlockNumber();
  console.log("Latest block number: ", blockNumber);

  let balance = await ethFeeToken.read.balanceOf([account.address as any]);
  console.log("FeeToken balance: $", formatEther(balance));

  if (balance === BigInt(0)) {
    console.warn("Token faucet not available. Please fund manually.");
    console.warn("Insufficient balance for address:", account.address);
  }

  const allowance = await ethFeeToken.read.allowance([
    account.address!,
    PING_MODULE_ADDRESS,
  ]);

  if (allowance === BigInt(0)) {
    console.log("Setting allowance .. ");
    const hash = await ethFeeToken.write.approve([
      PING_MODULE_ADDRESS,
      fromHex(
        "0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff",
        "bigint"
      ),
    ]);
    await ethSrcClient.waitForTransactionReceipt({ hash, confirmations: 1 });
  }

  console.log("Setting up hyperclient");

  const HyperbridgeConfig = {
    rpc_url: "wss://hyperbridge-paseo-rpc.blockops.network",
    state_machine: "KUSAMA-4009",
    consensus_state_id: "PAS0",
  };

  const hyperclient = await HyperClient.init({
    source: ETH_SRC,
    dest: ETH_DEST,
    hyperbridge: HyperbridgeConfig,
  });

  const wsProvider = new WsProvider(HyperbridgeConfig.rpc_url);
  const api = await ApiPromise.create({ provider: wsProvider });
  const height = (
    await api.query.ismp.latestStateMachineHeight({
      stateId: { Evm: 11155111 },
      consensusStateId: "ETH0",
    })
  ).toJSON() as number;

  // Encode the provided message as raw bytes for the first key
  const encodedKey = toHex(new TextEncoder().encode(message));
  console.log(`Sending message: "${message}"`);
  console.log(`Encoded key: ${encodedKey}`);
  
  const txHash = await ethPing.write.dispatch([
    {
      source: "0x",
      dest: ETH_DEST.state_machine,
      nonce: 0n,
      context: "0x",
      from: account.address,
      keys: [
        encodedKey,
        ethDestIsmpHost.address,
        ethDestHandler.address,
      ],
      height: BigInt(height),
      timeoutTimestamp: 0n,
    },
  ]);

  const txReceipt = await ethSrcClient.waitForTransactionReceipt({
    hash: txHash,
    confirmations: 1,
  });

  console.log(`Transaction receipt: https://sepolia.etherscan.io/tx/${txHash}`);
  console.log("Block: ", txReceipt.blockNumber);

  const txEvent = parseEventLogs({ abi: EVM_HOST.ABI, logs: txReceipt.logs })[0];
  if (txEvent.eventName !== "GetRequestEvent") throw new Error("Unexpected Event type");

  const getRequest = { ...txEvent.args };
  // Debug: log the full event args
  console.log("GetRequest event args:", txEvent.args);
  
  // Decode the first key as raw bytes to string
  const encodedKeyFromEvent = getRequest.keys[0];
  if (encodedKeyFromEvent && encodedKeyFromEvent !== "0x") {
    const decodedKey = Buffer.from(encodedKeyFromEvent.slice(2), "hex").toString();
    console.log("Decoded key from GetRequest:", decodedKey);
  } else {
    console.warn("Key is empty or zero data:", encodedKeyFromEvent);
  }
  
  // Decode the context field only if not empty
  const encodedContext = getRequest.context;
  if (encodedContext && encodedContext !== "0x") {
    const decodedContext = decodeAbiParameters(
      [{ type: "string" }],
      encodedContext
    )[0];
    console.log("Decoded context from GetRequest:", decodedContext);
  } else {
    console.warn("Context is empty or zero data:", encodedContext);
  }
  
  console.log("Status Dispatched");
  console.log(`Transaction submitted: https://sepolia.etherscan.io/tx/${txHash}`);
  console.log(`Status Dispatched, Transaction: https://sepolia.etherscan.io/tx/${txHash}`);
  
  console.log("Dispatch completed - returning transaction result");
  return {
    txHash,
    blockNumber: txReceipt.blockNumber,
    message,
    encodedKey
  };
}

async function scrapeMilkyWayEvents() {
  try {
    console.log("Fetching events from MilkyWay Data API...");
    
    const response = await fetch("https://milkywaydata.fly.dev/api/v1/events");
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const result = await response.json();
    
    if (!result.success) {
      throw new Error("API request was not successful");
    }
    
    // Submit the raw JSON data directly to the blockchain
    const rawJsonString = JSON.stringify(result);
    console.log("Submitting raw JSON data to blockchain...");
    console.log("JSON size:", rawJsonString.length, "characters");
    
    const txResult = await sendStringData(rawJsonString);
    
    console.log("Transaction result:", txResult);
    
    // Create submission record with proper structure
    const submission = {
      timestamp: new Date().toISOString(),
      summary: result, // Store the raw JSON data
      txHash: txResult.txHash,
      blockNumber: Number(txResult.blockNumber),
      explorerLink: `https://sepolia.etherscan.io/tx/${txResult.txHash}`
    };
    
    console.log("Created submission record:", submission);
    submissions.push(submission);
    console.log("Added to submissions array. Total submissions:", submissions.length);
    
    // Keep only last 10 submissions
    if (submissions.length > 10) {
      submissions.shift();
      console.log("Removed oldest submission. Current count:", submissions.length);
    }
    
    console.log("Event summary submitted successfully!");
    
    return {
      summary: result,
      rawData: result
    };
    
  } catch (error) {
    console.error("Error fetching MilkyWay events:", error);
    return null;
  }
}

async function setUp() {
  const account = privateKeyToAccount(process.env.PRIVATE_KEY as any);

  // Both source and destination are Sepolia
  const ethWalletClient = createWalletClient({ chain: sepolia, account, transport: http() });
  const ethPublicClient = createPublicClient({ chain: sepolia, transport: http() });

  // Source contracts
  const ethPing = getContract({
    address: PING_MODULE_ADDRESS,
    abi: PING_MODULE.ABI,
    client: { public: ethPublicClient, wallet: ethWalletClient },
  });

  const ethIsmpHostAddress = await ethPing.read.host();
  const ethIsmpHost = getContract({
    address: ethIsmpHostAddress,
    abi: EVM_HOST.ABI,
    client: ethPublicClient,
  });

  const ethHostParams = await ethIsmpHost.read.hostParams();
  const ethHandler = getContract({
    address: ethHostParams.handler,
    abi: HANDLER.ABI,
    client: { public: ethPublicClient, wallet: ethWalletClient },
  });

  const ethFeeToken = getContract({
    address: ethHostParams.feeToken,
    abi: ERC6160.ABI,
    client: { public: ethPublicClient, wallet: ethWalletClient },
  });

  // Destination contracts (also Sepolia)
  const ethDestPing = getContract({
    address: PING_MODULE_ADDRESS,
    abi: PING_MODULE.ABI,
    client: ethPublicClient,
  });

  const ethDestIsmpHostAddress = await ethDestPing.read.host();
  const ethDestIsmpHost = getContract({
    address: ethDestIsmpHostAddress,
    abi: EVM_HOST.ABI,
    client: ethPublicClient,
  });

  const ethDestHostParams = await ethDestIsmpHost.read.hostParams();
  const ethDestHandler = getContract({
    address: ethDestHostParams.handler,
    abi: HANDLER.ABI,
    client: { public: ethPublicClient, wallet: ethWalletClient },
  });

  // Add token faucet for Sepolia (using the same address as BSC for now)
  const tokenFaucet = getContract({
    address: "0x17d8cc0859fbA942A7af243c3EBB69AbBfe0a320",
    abi: parseAbi(["function drip(address token) public"]),
    client: { public: ethPublicClient, wallet: ethWalletClient },
  });

  const ETH_SRC = {
    rpc_url: process.env.ETH_URL!,
    consensus_state_id: "ETH0",
    host_address: ethIsmpHostAddress,
    state_machine: await ethIsmpHost.read.host(),
  };

  const ETH_DEST = {
    rpc_url: process.env.ETH_URL!,
    consensus_state_id: "ETH0",
    host_address: ethDestIsmpHostAddress,
    state_machine: await ethDestIsmpHost.read.host(),
  };

  return {
    ethSrcClient: ethPublicClient,
    ethFeeToken,
    account,
    ETH_SRC,
    ETH_DEST,
    ethDestHandler,
    ethHandler,
    ethPing,
    ethDestClient: ethPublicClient,
    ethDestIsmpHost,
    tokenFaucet,
  };
}

config();
//testPostAndGetRequest()
// testPostRequest();
// testGetRequest();

// Example usage of the new sendStringData function
// sendStringData("Hello from the blockchain!");

// Call the MilkyWay events scraping function every 10 minutes
setInterval(async () => {
  try {
    console.log('Starting periodic scraping...');
    await scrapeMilkyWayEvents();
    console.log('Periodic scraping completed successfully');
  } catch (err) {
    console.error('Error in periodic scraping:', err);
  }
}, 600000);

// Run initial scraping immediately
console.log('Running initial scraping...');
scrapeMilkyWayEvents().then(() => {
  console.log('Initial scraping completed');
}).catch(err => {
  console.error('Error in initial scraping:', err);
});

// Array to store the last 10 submissions
const submissions: Array<{
  timestamp: string;
  summary: any;
  txHash: string;
  blockNumber: number;
  explorerLink: string;
}> = [];



const server = createServer((req, res) => {
  if (req.url === '/submissions' && req.method === 'GET') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      success: true,
      data: submissions.slice(-10), // Return last 10 submissions
      total: submissions.length
    }));
  } else if (req.url === '/example' && req.method === 'GET') {
    handleExampleEndpoint(req, res);
  } else {
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Not found' }));
  }
});

server.listen(5001, () => {
  console.log('HTTP server running on port 5001');
  console.log('GET /submissions - Returns last 10 submissions');
  console.log('GET /example - Returns hardcoded example data');
});
