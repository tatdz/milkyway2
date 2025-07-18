import { useState, useEffect } from "react";
import type { InjectedAccountWithMeta, InjectedExtension } from "@polkadot/extension-inject/types";

interface WalletState {
  account: InjectedAccountWithMeta | null;
  isConnected: boolean;
  isLoading: boolean;
  extension: InjectedExtension | null;
}

export function useWallet() {
  const [walletState, setWalletState] = useState<WalletState>({
    account: null,
    isConnected: false,
    isLoading: false,
    extension: null,
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
      
      const account = accounts[0];
      const extension = extensions[0];
      
      setWalletState({
        account,
        isConnected: true,
        isLoading: false,
        extension,
      });
      
      // Store in localStorage for persistence
      localStorage.setItem("milkyway2_account", JSON.stringify({
        address: account.address,
        name: account.meta.name
      }));
      
    } catch (error) {
      console.error("Wallet connection failed:", error);
      setWalletState({
        account: null,
        isConnected: false,
        isLoading: false,
        extension: null,
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
      extension: null,
    });
    localStorage.removeItem("milkyway2_account");
  };

  // Check for stored account on mount
  useEffect(() => {
    const storedAccountData = localStorage.getItem("milkyway2_account");
    if (storedAccountData) {
      try {
        const accountInfo = JSON.parse(storedAccountData);
        // Create a minimal account object for persistence
        const account = {
          address: accountInfo.address,
          meta: { name: accountInfo.name || "Stored Account" }
        } as InjectedAccountWithMeta;
        
        setWalletState({
          account,
          isConnected: true,
          isLoading: false,
          extension: null, // Will be set when user performs actions requiring signing
        });
      } catch (error) {
        console.warn("Failed to parse stored account data:", error);
        localStorage.removeItem("milkyway2_account");
      }
    }
  }, []);

  return {
    ...walletState,
    connect,
    disconnect,
  };
}
