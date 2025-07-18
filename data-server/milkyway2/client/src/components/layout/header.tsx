import WalletConnectButton from "@/components/wallet/wallet-connect-button";
import { useQuery } from "@tanstack/react-query";

interface HeaderProps {
  title: string;
  subtitle: string;
}

export default function Header({ title, subtitle }: HeaderProps) {
  const { data: networkStatus } = useQuery({
    queryKey: ["/api/network/status"],
  });

  return (
    <header className="bg-slate-900 border-b border-slate-800 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div>
            <h2 className="text-xl font-semibold text-slate-50">{title}</h2>
            <p className="text-sm text-slate-400">{subtitle}</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="hidden md:flex items-center space-x-2 text-sm text-slate-400">
            <div className="w-2 h-2 bg-success rounded-full animate-pulse-slow"></div>
            <span>Live Data</span>
          </div>
          
          <WalletConnectButton />
        </div>
      </div>
    </header>
  );
}
