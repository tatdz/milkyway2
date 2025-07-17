import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { 
  LayoutDashboard, 
  Users, 
  Vote, 
  Shield, 
  FileText, 
  Bell 
} from "lucide-react";

const navigation = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard },
  { name: "Validators", href: "/validators", icon: Users },
  { name: "Governance", href: "/governance", icon: Vote },
  { name: "Incident Reports", href: "/reports", icon: Shield },
  { name: "Documentation", href: "/documentation", icon: FileText },
];

export default function Sidebar() {
  const [location] = useLocation();

  return (
    <div className="fixed inset-y-0 left-0 z-50 w-64 bg-slate-900 border-r border-slate-800 transform transition-transform duration-300 ease-in-out lg:translate-x-0">
      {/* Logo */}
      <div className="flex items-center justify-between h-16 px-6 border-b border-slate-800">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gradient-to-r from-primary to-purple-600 rounded-lg flex items-center justify-center">
            <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
          </div>
          <h1 className="text-xl font-bold text-slate-50">Milkyway2</h1>
        </div>
      </div>
      
      {/* Navigation */}
      <nav className="mt-6 px-3">
        <div className="space-y-1">
          {navigation.map((item) => {
            const isActive = location === item.href || (item.href !== "/" && location.startsWith(item.href));
            return (
              <Link key={item.name} href={item.href}>
                <a className={cn(
                  "group flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors",
                  isActive 
                    ? "bg-primary text-white" 
                    : "text-slate-300 hover:bg-slate-800 hover:text-white"
                )}>
                  <item.icon className="w-5 h-5 mr-3" />
                  {item.name}
                </a>
              </Link>
            );
          })}
        </div>
        
        {/* Settings Section */}
        <div className="mt-8 pt-4 border-t border-slate-800">
          <div className="px-3 py-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Settings
          </div>
          <Link href="/notifications">
            <a className="group flex items-center px-3 py-2 text-sm font-medium text-slate-300 rounded-lg hover:bg-slate-800 hover:text-white transition-colors">
              <Bell className="w-5 h-5 mr-3" />
              Notifications
            </a>
          </Link>
        </div>
      </nav>
    </div>
  );
}
