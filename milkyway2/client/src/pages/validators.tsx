import { useQuery } from "@tanstack/react-query";
import Header from "@/components/layout/header";
import AlertCard from "@/components/validators/alert-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function Validators() {
  const { data: validators, isLoading } = useQuery({
    queryKey: ["/api/validators"],
  });

  const { data: goodValidators } = useQuery({
    queryKey: ["/api/validators/good"],
  });

  const { data: neutralValidators } = useQuery({
    queryKey: ["/api/validators/neutral"],
  });

  const { data: badValidators } = useQuery({
    queryKey: ["/api/validators/bad"],
  });

  return (
    <div className="min-h-screen bg-slate-950">
      <Header 
        title="Validator Management"
        subtitle="Monitor and analyze validator performance across the network"
      />

      <main className="p-6">
        <Tabs defaultValue="all" className="space-y-6">
          <TabsList className="bg-slate-850 border-slate-800">
            <TabsTrigger value="all" className="data-[state=active]:bg-primary">All Validators</TabsTrigger>
            <TabsTrigger value="good" className="data-[state=active]:bg-success">Good</TabsTrigger>
            <TabsTrigger value="neutral" className="data-[state=active]:bg-warning">Neutral</TabsTrigger>
            <TabsTrigger value="bad" className="data-[state=active]:bg-danger">Bad</TabsTrigger>
          </TabsList>

          <TabsContent value="all">
            <Card className="bg-slate-850 border-slate-800">
              <CardHeader>
                <CardTitle className="text-slate-50">All Validators</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {isLoading ? (
                  <div className="space-y-4">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <div key={i} className="p-4 bg-slate-900 rounded-lg animate-pulse">
                        <div className="h-4 bg-slate-700 rounded w-1/3 mb-2"></div>
                        <div className="h-3 bg-slate-700 rounded w-2/3"></div>
                      </div>
                    ))}
                  </div>
                ) : (
                  validators?.data?.map((validator) => (
                    <AlertCard key={validator.id} validator={validator} />
                  ))
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="good">
            <Card className="bg-slate-850 border-slate-800">
              <CardHeader>
                <CardTitle className="text-slate-50">Good Validators</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {goodValidators?.data?.map((validator) => (
                  <AlertCard key={validator.id} validator={validator} />
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="neutral">
            <Card className="bg-slate-850 border-slate-800">
              <CardHeader>
                <CardTitle className="text-slate-50">Neutral Validators</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {neutralValidators?.data?.map((validator) => (
                  <AlertCard key={validator.id} validator={validator} />
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="bad">
            <Card className="bg-slate-850 border-slate-800">
              <CardHeader>
                <CardTitle className="text-slate-50">Bad Validators</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {badValidators?.data?.map((validator) => (
                  <AlertCard key={validator.id} validator={validator} />
                ))}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
