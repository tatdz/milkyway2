import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Wallet } from "lucide-react";
import { useWallet } from "@/hooks/use-wallet";

export default function WalletConnectButton() {
  const { account, isConnected, connect, disconnect } = useWallet();

  const formatAddress = (address: string | undefined) => {
    if (!address || typeof address !== 'string') return 'Invalid Address';
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  return (
    <Button 
      className="bg-primary hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2"
      onClick={isConnected ? disconnect : connect}
    >
      <Wallet className="w-5 h-5" />
      <span>
        {isConnected && account?.address ? formatAddress(account.address) : "Connect Wallet"}
      </span>
    </Button>
  );
}
