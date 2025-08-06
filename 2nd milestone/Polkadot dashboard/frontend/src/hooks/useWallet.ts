// src/hooks/useWallets.ts
import { useState, useEffect } from 'react';
import { web3Enable, web3Accounts } from '@polkadot/extension-dapp';
import { ethers } from 'ethers';

export function usePolkadotWallet() {
  const [accounts, setAccounts] = useState<{ address: string; name?: string }[]>([]);
  const [isConnected, setConnected] = useState(false);

  useEffect(() => {
    (async () => {
      const extensions = await web3Enable('Milkyway2 Dashboard');
      if (extensions.length === 0) return;
      const allAccounts = await web3Accounts();
      setAccounts(allAccounts);
      setConnected(allAccounts.length > 0);
    })();
  }, []);

  return { accounts, isConnected };
}

export function useEvmWallet() {
  const [account, setAccount] = useState<string | null>(null);
  const [provider, setProvider] = useState<ethers.providers.Web3Provider | null>(null);

  useEffect(() => {
    if ((window as any).ethereum) {
      const prov = new ethers.providers.Web3Provider((window as any).ethereum);
      setProvider(prov);
      prov.listAccounts().then(accounts => {
        if (accounts.length > 0) setAccount(accounts[0]);
      });
    }
  }, []);

  async function connect() {
    if (!provider) throw new Error('MetaMask or compatible wallet not detected');
    const accounts = await provider.send('eth_requestAccounts', []);
    if (accounts.length > 0) setAccount(accounts[0]);
  }

  return { account, connect, provider };
}
