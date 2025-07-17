import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Dashboard from "@/pages/dashboard";
import Validators from "@/pages/validators";
import Governance from "@/pages/governance";
import Reports from "@/pages/reports";
import Documentation from "@/pages/documentation";
import Notifications from "@/pages/notifications";
import ValidatorOnboarding from "@/pages/validator-onboarding";
import Sidebar from "@/components/layout/sidebar";
import { useEffect } from "react";

function Router() {
  return (
    <div className="flex min-h-screen bg-slate-950">
      <Sidebar />
      <div className="flex-1 lg:ml-64">
        <Switch>
          <Route path="/" component={Dashboard} />
          <Route path="/dashboard" component={Dashboard} />
          <Route path="/validators" component={Validators} />
          <Route path="/governance" component={Governance} />
          <Route path="/reports" component={Reports} />
          <Route path="/documentation" component={Documentation} />
          <Route path="/notifications" component={Notifications} />
          <Route path="/validator-onboarding" component={ValidatorOnboarding} />
          <Route>
            <div className="flex items-center justify-center min-h-screen">
              <div className="text-center">
                <h1 className="text-2xl font-bold text-slate-50 mb-4">404 - Page Not Found</h1>
                <p className="text-slate-400">The page you're looking for doesn't exist.</p>
              </div>
            </div>
          </Route>
        </Switch>
      </div>
    </div>
  );
}

function App() {
  useEffect(() => {
    // Apply dark theme by default
    document.documentElement.classList.add('dark');
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
