export const SEMAPHORE_CONTRACT_ADDRESS = "0x8EabBe844d33Ac35BBBe340BE5F14001bb17d92D";
export const PASSET_BLOCKSCOUT_URL = "https://blockscout-passet-hub.parity-testnet.parity.io";

export const POLKADOT_RPC_ENDPOINTS = [
  "wss://rpc.polkadot.io",
  "wss://polkadot-rpc.dwellir.com",
  "wss://polkadot.api.onfinality.io/public-ws",
];

export const INCIDENT_TYPES = [
  "Offline/Unresponsive",
  "Slash Event", 
  "Governance Violation",
  "Other",
] as const;

export const VALIDATOR_RISK_THRESHOLDS = {
  COMMISSION_HIGH: 2000, // 20%
  COMMISSION_MODERATE: 1000, // 10%
  UPTIME_LOW: 85,
  UPTIME_MODERATE: 95,
} as const;

export const NETWORK_STATUS_REFRESH_INTERVAL = 30000; // 30 seconds
export const VALIDATOR_DATA_REFRESH_INTERVAL = 60000; // 1 minute
export const GOVERNANCE_DATA_REFRESH_INTERVAL = 120000; // 2 minutes
