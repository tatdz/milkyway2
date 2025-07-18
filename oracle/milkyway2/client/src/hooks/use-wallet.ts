import { useState, useEffect } from "react";

interface WalletState {
  account: string | null;
  isConnected: boolean;
  isLoading: boolean;
}

export function useWallet() {
  const [walletState, setWalletState] = useState<WalletState>({
    account: null,
    isConnected: false,
    isLoading: false,
  });

  const connect = async () => {
    setWalletState(prev => ({ ...prev, isLoading: true }));
    
    try {
      // Check if Polkadot extension is available
      const { web3Enable, web3Accounts } = await import("@polkadot/extension-dapp");
      
      // Enable the extension
      const extensions = await web3Enable("Milkyway2");
      
      if (extensions.length === 0) {
        throw new Error("No Polkadot extension found. Please install SubWallet or Polkadot.js extension.");
      }
      
      // Get accounts
      const accounts = await web3Accounts();
      
      if (accounts.length === 0) {
        throw new Error("No accounts found. Please create an account in your wallet extension.");
      }
      
      const account = accounts[0].address;
      setWalletState({
        account,
        isConnected: true,
        isLoading: false,
      });
      
      // Store in localStorage for persistence
      localStorage.setItem("milkyway2_account", account);
      
    } catch (error) {
      console.error("Wallet connection failed:", error);
      setWalletState({
        account: null,
        isConnected: false,
        isLoading: false,
      });
      
      // Show user-friendly error
      alert(error instanceof Error ? error.message : "Failed to connect wallet");
    }
  };

  const disconnect = () => {
    setWalletState({
      account: null,
      isConnected: false,
      isLoading: false,
    });
    localStorage.removeItem("milkyway2_account");
  };

  // Check for stored account on mount
  useEffect(() => {
    const storedAccount = localStorage.getItem("milkyway2_account");
    if (storedAccount) {
      setWalletState({
        account: storedAccount,
        isConnected: true,
        isLoading: false,
      });
    }
  }, []);

  return {
    ...walletState,
    connect,
    disconnect,
  };
}
