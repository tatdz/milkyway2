import { Keyring } from '@polkadot/keyring';
import { cryptoWaitReady } from '@polkadot/util-crypto';

async function main() {
  await cryptoWaitReady();  // Wait for WASM to initialize

  const keyring = new Keyring({ type: 'sr25519' });
  const pair = keyring.addFromUri('//OracleSecretSeed');

  console.log('Public key:', pair.publicKey.toString());
}

main().catch(console.error);
