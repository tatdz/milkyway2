import { useQuery } from "@tanstack/react-query";
import Header from "@/components/layout/header";
import ValidatorStats from "@/components/validators/validator-stats";
import AlertCard from "@/components/validators/alert-card";
import NetworkStatus from "@/components/network/network-status";
import ReferendumCard from "@/components/governance/referendum-card";
import ZKReportModal from "@/components/reports/zk-report-modal";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, Users, AlertTriangle, CheckCircle, ExternalLink } from "lucide-react";
import { useState } from "react";

export default function Dashboard() {
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);

  const { data: validators, isLoading: loadingValidators } = useQuery({
    queryKey: ["/api/validators"],
  });

  const { data: referenda, isLoading: loadingReferenda } = useQuery({
    queryKey: ["/api/referenda"],
  });

  const { data: networkStatus, isLoading: loadingNetwork } = useQuery({
    queryKey: ["/api/network/status"],
  });

  const stats = networkStatus?.data || {};

  return (
    <div className="min-h-screen bg-slate-950">
      <Header 
        title="Validator Risk Dashboard"
        subtitle="A unified lens on risk and collaboration for users and validators on Polkadot, Kusama and parachains"
      />

      <main className="p-6 space-y-6">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="bg-slate-850 border-slate-800">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm font-medium">Active Validators</p>
                  <p className="text-2xl font-bold text-slate-50">
                    {loadingNetwork ? "..." : stats.activeValidators?.toLocaleString() || "1,247"}
                  </p>
                </div>
                <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center">
                  <Users className="w-6 h-6 text-primary" />
                </div>
              </div>
              <div className="mt-4 flex items-center">
                <span className="text-success text-sm font-medium">+2.3%</span>
                <span className="text-slate-400 text-sm ml-2">vs last week</span>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-850 border-slate-800">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm font-medium">Risk Alerts</p>
                  <p className="text-2xl font-bold text-slate-50">
                    {loadingNetwork ? "..." : stats.totalAlerts || "23"}
                  </p>
                </div>
                <div className="w-12 h-12 bg-warning/20 rounded-lg flex items-center justify-center">
                  <AlertTriangle className="w-6 h-6 text-warning" />
                </div>
              </div>
              <div className="mt-4 flex items-center">
                <span className="text-danger text-sm font-medium">+4</span>
                <span className="text-slate-400 text-sm ml-2">new today</span>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-850 border-slate-800">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm font-medium">ZK Reports</p>
                  <p className="text-2xl font-bold text-slate-50">
                    {loadingNetwork ? "..." : stats.zkReports || "156"}
                  </p>
                </div>
                <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center">
                  <Shield className="w-6 h-6 text-purple-400" />
                </div>
              </div>
              <div className="mt-4 flex items-center">
                <span className="text-success text-sm font-medium">100%</span>
                <span className="text-slate-400 text-sm ml-2">anonymous</span>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-850 border-slate-800">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm font-medium">Network Health</p>
                  <p className="text-2xl font-bold text-success">
                    {loadingNetwork ? "..." : `${stats.health || 97.2}%`}
                  </p>
                </div>
                <div className="w-12 h-12 bg-success/20 rounded-lg flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-success" />
                </div>
              </div>
              <div className="mt-4 flex items-center">
                <span className="text-success text-sm font-medium">Optimal</span>
                <span className="text-slate-400 text-sm ml-2">performance</span>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Validator Alerts */}
          <div className="lg:col-span-2">
            <Card className="bg-slate-850 border-slate-800">
              <CardHeader className="border-b border-slate-800">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-slate-50">Validator Risk Alerts</CardTitle>
                  <Button variant="ghost" size="sm" className="text-slate-400 hover:text-slate-200">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M4 3a2 2 0 100 4h12a2 2 0 100-4H4z"/>
                      <path fillRule="evenodd" d="M3 8a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"/>
                    </svg>
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                {loadingValidators ? (
                  <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="p-4 bg-slate-900 rounded-lg animate-pulse">
                        <div className="h-4 bg-slate-700 rounded w-1/3 mb-2"></div>
                        <div className="h-3 bg-slate-700 rounded w-2/3"></div>
                      </div>
                    ))}
                  </div>
                ) : (
                  validators?.data?.slice(0, 3).map((validator) => (
                    <AlertCard key={validator.id} validator={validator} />
                  ))
                )}
                <div className="text-center pt-4">
                  <Button variant="ghost" className="text-primary hover:text-indigo-400">
                    View All Validators
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <div className="space-y-6">
            {/* Anonymous Reporting */}
            <Card className="bg-slate-850 border-slate-800">
              <CardContent className="p-6">
                <CardTitle className="text-slate-50 mb-4">Anonymous Reporting</CardTitle>
                <p className="text-slate-300 text-sm mb-6">
                  Report validator incidents using zero-knowledge proofs for complete anonymity.
                </p>
                
                <Button 
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white"
                  onClick={() => setIsReportModalOpen(true)}
                >
                  <Shield className="w-5 h-5 mr-2" />
                  Submit ZK Report
                </Button>
                
                <div className="mt-4 p-3 bg-slate-900 rounded-lg">
                  <div className="flex items-center space-x-2 text-xs text-slate-400">
                    <svg className="w-4 h-4 text-purple-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"/>
                    </svg>
                    <span>Powered by Semaphore ZK</span>
                  </div>
                </div>
                
                <Button 
                  className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white"
                  onClick={() => window.open('https://oracle-frontend-milkyway.fly.dev/', '_blank')}
                >
                  <ExternalLink className="w-5 h-5 mr-2" />
                  Validator Events
                </Button>
              </CardContent>
            </Card>

            {/* Network Status */}
            <NetworkStatus />
          </div>
        </div>

        {/* Governance Section */}
        <Card className="bg-slate-850 border-slate-800">
          <CardHeader className="border-b border-slate-800">
            <div className="flex items-center justify-between">
              <CardTitle className="text-slate-50">OpenGov Referenda</CardTitle>
              <Button variant="ghost" size="sm" className="text-slate-400 hover:text-slate-200">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z"/>
                </svg>
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {loadingReferenda ? (
                <div className="col-span-full text-center text-slate-400">Loading referenda...</div>
              ) : (
                referenda?.data?.slice(0, 3).map((referendum) => (
                  <ReferendumCard key={referendum.id} referendum={referendum} />
                ))
              )}
            </div>
            <div className="text-center pt-6">
              <Button variant="ghost" className="text-primary hover:text-indigo-400">
                View All Referenda
              </Button>
            </div>
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
