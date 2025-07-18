import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import Header from "@/components/layout/header";
import ZKReportModal from "@/components/reports/zk-report-modal";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Shield, Plus } from "lucide-react";

export default function Reports() {
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);

  const { data: reports, isLoading } = useQuery({
    queryKey: ["/api/reports"],
  });

  const getIncidentTypeColor = (type: string) => {
    switch (type) {
      case "Offline/Unresponsive":
        return "bg-warning/20 text-warning";
      case "Slash Event":
        return "bg-danger/20 text-danger";
      case "Governance Violation":
        return "bg-purple-500/20 text-purple-400";
      default:
        return "bg-slate-700 text-slate-300";
    }
  };

  return (
    <div className="min-h-screen bg-slate-950">
      <Header 
        title="Incident Reports"
        subtitle="Anonymous validator incident reporting using zero-knowledge proofs"
      />

      <main className="p-6 space-y-6">
        {/* Submit Report Card */}
        <Card className="bg-slate-850 border-slate-800">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-slate-50 mb-2">Submit Anonymous Report</h3>
                <p className="text-slate-300 text-sm">
                  Report validator incidents with complete anonymity using Semaphore zero-knowledge proofs.
                </p>
              </div>
              <Button 
                className="bg-purple-600 hover:bg-purple-700 text-white"
                onClick={() => setIsReportModalOpen(true)}
              >
                <Plus className="w-4 h-4 mr-2" />
                New Report
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Reports List */}
        <Card className="bg-slate-850 border-slate-800">
          <CardHeader>
            <CardTitle className="text-slate-50">Recent Reports</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-4">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="p-4 bg-slate-900 rounded-lg border border-slate-800 animate-pulse">
                    <div className="h-4 bg-slate-700 rounded w-1/3 mb-2"></div>
                    <div className="h-3 bg-slate-700 rounded w-2/3 mb-2"></div>
                    <div className="h-3 bg-slate-700 rounded w-1/4"></div>
                  </div>
                ))}
              </div>
            ) : reports?.data?.length ? (
              <div className="space-y-4">
                {reports.data.map((report) => (
                  <div key={report.id} className="p-4 bg-slate-900 rounded-lg border border-slate-800">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h4 className="font-medium text-slate-50 mb-1">
                          Validator: {report.validatorStash}
                        </h4>
                        <Badge className={getIncidentTypeColor(report.incidentType)}>
                          {report.incidentType}
                        </Badge>
                      </div>
                      <div className="flex items-center space-x-2">
                        {report.isVerified && (
                          <Badge className="bg-success/20 text-success">
                            Verified
                          </Badge>
                        )}
                        <Shield className="w-4 h-4 text-purple-400" />
                      </div>
                    </div>
                    
                    {report.description && (
                      <p className="text-slate-300 text-sm mb-3">{report.description}</p>
                    )}
                    
                    <div className="flex items-center justify-between text-xs text-slate-400">
                      <span>Nullifier: {report.nullifierHash.slice(0, 16)}...</span>
                      <span>{new Date(report.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Shield className="w-12 h-12 text-slate-600 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-slate-400 mb-2">No Reports Yet</h3>
                <p className="text-slate-500 text-sm">
                  Be the first to submit an anonymous incident report using zero-knowledge proofs.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </main>

      <ZKReportModal 
        isOpen={isReportModalOpen} 
        onClose={() => setIsReportModalOpen(false)} 
      />
    </div>
  );
}
