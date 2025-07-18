import { useQuery } from "@tanstack/react-query";
import Header from "@/components/layout/header";
import ReferendumCard from "@/components/governance/referendum-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Governance() {
  const { data: referenda, isLoading } = useQuery({
    queryKey: ["/api/referenda"],
  });

  return (
    <div className="min-h-screen bg-slate-950">
      <Header 
        title="OpenGov Referenda"
        subtitle="Track and monitor Polkadot governance proposals and voting"
      />

      <main className="p-6">
        <Card className="bg-slate-850 border-slate-800">
          <CardHeader>
            <CardTitle className="text-slate-50">Active Referenda</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="bg-slate-900 rounded-lg p-4 border border-slate-800 animate-pulse">
                    <div className="h-4 bg-slate-700 rounded w-2/3 mb-3"></div>
                    <div className="h-3 bg-slate-700 rounded w-1/3 mb-4"></div>
                    <div className="h-3 bg-slate-700 rounded w-full mb-2"></div>
                    <div className="h-3 bg-slate-700 rounded w-3/4"></div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {referenda?.data?.map((referendum) => (
                  <ReferendumCard key={referendum.id} referendum={referendum} />
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
