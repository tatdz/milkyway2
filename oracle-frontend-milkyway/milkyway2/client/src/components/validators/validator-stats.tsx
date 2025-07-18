import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface ValidatorStatsProps {
  stats: {
    active: number;
    alerts: number;
    reports: number;
    health: number;
  };
}

export default function ValidatorStats({ stats }: ValidatorStatsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <Card className="bg-slate-850 border-slate-800">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm font-medium">Active Validators</p>
              <p className="text-2xl font-bold text-slate-50">{stats.active.toLocaleString()}</p>
            </div>
            <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-primary" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z"/>
              </svg>
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
              <p className="text-2xl font-bold text-slate-50">{stats.alerts}</p>
            </div>
            <div className="w-12 h-12 bg-warning/20 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-warning" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"/>
              </svg>
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
              <p className="text-2xl font-bold text-slate-50">{stats.reports}</p>
            </div>
            <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-purple-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M3 6a3 3 0 013-3h10a1 1 0 01.8 1.6L14.25 8l2.55 3.4A1 1 0 0116 13H6a1 1 0 00-1 1v3a1 1 0 11-2 0V6z"/>
              </svg>
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
              <p className="text-2xl font-bold text-success">{stats.health}%</p>
            </div>
            <div className="w-12 h-12 bg-success/20 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-success" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"/>
              </svg>
            </div>
          </div>
          <div className="mt-4 flex items-center">
            <span className="text-success text-sm font-medium">Optimal</span>
            <span className="text-slate-400 text-sm ml-2">performance</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
