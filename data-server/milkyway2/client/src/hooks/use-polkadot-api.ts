import { useState, useEffect } from "react";
import { ApiPromise, WsProvider } from "@polkadot/api";

export function usePolkadotApi() {
  const [api, setApi] = useState<ApiPromise | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    const connectToPolkadot = async () => {
      try {
        const wsProvider = new WsProvider("wss://rpc.polkadot.io");
        const apiInstance = await ApiPromise.create({ provider: wsProvider });
        
        if (mounted) {
          setApi(apiInstance);
          setIsConnected(true);
          setError(null);
        }
      } catch (err) {
        if (mounted) {
          setError(err instanceof Error ? err.message : "Failed to connect to Polkadot network");
          setIsConnected(false);
        }
      }
    };

    connectToPolkadot();

    return () => {
      mounted = false;
      if (api) {
        api.disconnect();
      }
    };
  }, []);

  return { api, isConnected, error };
}
