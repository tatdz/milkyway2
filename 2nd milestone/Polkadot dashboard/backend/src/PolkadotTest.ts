import { ApiPromise, WsProvider } from '@polkadot/api';

async function main() {
  let api: ApiPromise | null = null;
  
  try {
    console.log('Connecting to Polkadot...');
    
    // Create provider
    const provider = new WsProvider('wss://rpc.polkadot.io');
    
    // Create the API instance
    api = await ApiPromise.create({ 
      provider,
      throwOnConnect: true,
      throwOnUnknown: true
    });

    console.log('Connected to:', (await api.rpc.system.chain()).toString());
    console.log('Node version:', (await api.rpc.system.version()).toString());
    
    // Get the latest block header
    const lastHeader = await api.rpc.chain.getHeader();
    console.log('Latest block number:', lastHeader.number.toString());
    
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  } finally {
    if (api) {
      await api.disconnect();
      console.log('Disconnected from API');
    }
  }
}

main().catch(console.error);