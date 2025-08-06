// src/PolkadotStaking.ts
import { ApiPromise, WsProvider } from '@polkadot/api';

async function main() {
  console.log('Starting connection...');
  
  const provider = new WsProvider('wss://rpc.polkadot.io');
  const api = await ApiPromise.create({ provider });
  
  console.log('Connected to:', (await api.rpc.system.chain()).toString());
  console.log('Node version:', (await api.rpc.system.version()).toString());
  
  await api.disconnect();
  console.log('Disconnected');
}

main().catch(console.error);