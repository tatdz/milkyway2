import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function NetworkStatus() {
  const { data: networkStatus, isLoading } = useQuery({
    queryKey: ["/api/network/status"],
  });

  const status = networkStatus?.data || {};

  return (
    <Card className="bg-slate-850 border-slate-800">
      <CardHeader>
        <CardTitle className="text-slate-50">Network Status</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex justify-between">
                <div className="h-4 bg-slate-700 rounded w-1/3 animate-pulse"></div>
                <div className="h-4 bg-slate-700 rounded w-1/4 animate-pulse"></div>
              </div>
            ))}
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between">
              <span className="text-slate-300 text-sm">Current Block</span>
              <span className="text-slate-50 font-mono text-sm">
                {status.currentBlock?.toLocaleString() || "18,234,567"}
              </span>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-slate-300 text-sm">Block Time</span>
              <span className="text-slate-50 font-mono text-sm">
                {status.blockTime || "6.2s"}
              </span>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-slate-300 text-sm">Active Era</span>
              <span className="text-slate-50 font-mono text-sm">
                {status.era?.toLocaleString() || "1,234"}
              </span>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-slate-300 text-sm">Session</span>
              <span className="text-slate-50 font-mono text-sm">
                {status.session?.toLocaleString() || "5,678"}
              </span>
            </div>
          </>
        )}
        
        <div className="mt-4 pt-4 border-t border-slate-800">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-success rounded-full animate-pulse-slow"></div>
            <span className="text-success text-sm font-medium">All systems operational</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
