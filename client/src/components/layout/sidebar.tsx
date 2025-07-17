import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { 
  LayoutDashboard, 
  Users, 
  Vote, 
  Shield, 
  FileText, 
  Bell,
  MessageSquareCode
} from "lucide-react";
import Logo from "@/components/ui/logo";

const navigation = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard },
  { name: "Validators", href: "/validators", icon: Users },
  { name: "Governance", href: "/governance", icon: Vote },
  { name: "Incident Reports", href: "/reports", icon: Shield },
  { name: "Validator Messaging", href: "/validator-onboarding", icon: MessageSquareCode },
  { name: "Documentation", href: "/documentation", icon: FileText },
];

export default function Sidebar() {
  const [location] = useLocation();

  return (
    <div className="fixed inset-y-0 left-0 z-50 w-64 bg-slate-900 border-r border-slate-800 transform transition-transform duration-300 ease-in-out lg:translate-x-0">
      {/* Logo */}
      <div className="flex items-center justify-between h-16 px-6 border-b border-slate-800">
        <Logo size="sm" />
      </div>
      
      {/* Navigation */}
      <nav className="mt-6 px-3">
        <div className="space-y-1">
          {navigation.map((item) => {
            const isActive = location === item.href || (item.href !== "/" && location.startsWith(item.href));
            return (
              <Link key={item.name} href={item.href}>
                <div className={cn(
                  "group flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors cursor-pointer",
                  isActive 
                    ? "bg-primary text-white" 
                    : "text-slate-300 hover:bg-slate-800 hover:text-white"
                )}>
                  <item.icon className="w-5 h-5 mr-3" />
                  {item.name}
                </div>
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
            <div className="group flex items-center px-3 py-2 text-sm font-medium text-slate-300 rounded-lg hover:bg-slate-800 hover:text-white transition-colors cursor-pointer">
              <Bell className="w-5 h-5 mr-3" />
              Notifications
            </div>
          </Link>
        </div>
      </nav>
    </div>
  );
}
