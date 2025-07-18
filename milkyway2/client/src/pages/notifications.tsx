import { useState } from "react";
import Header from "@/components/layout/header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Bell, Mail, MessageSquare, Settings, Check } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function Notifications() {
  const [emailNotifications, setEmailNotifications] = useState(false);
  const [smsNotifications, setSmsNotifications] = useState(false);
  const [riskThreshold, setRiskThreshold] = useState("medium");
  const [emailAddress, setEmailAddress] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const { toast } = useToast();

  const handleSaveSettings = () => {
    toast({
      title: "Settings Saved",
      description: "Your notification preferences have been updated.",
    });
  };

  const notificationHistory = [
    {
      id: 1,
      type: "risk_alert",
      title: "High Risk Validator Detected",
      message: "Validator 5F3sa2TJAe...Bad has been slashed. Consider switching.",
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
      read: false,
      severity: "critical"
    },
    {
      id: 2,
      type: "governance",
      title: "New Referendum Active",
      message: "Referendum #237 is now open for voting.",
      timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6 hours ago
      read: true,
      severity: "info"
    },
    {
      id: 3,
      type: "validator_update",
      title: "Commission Rate Changed",
      message: "Your nominated validator updated commission to 8%.",
      timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
      read: true,
      severity: "warning"
    }
  ];

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical":
        return "bg-danger/20 text-danger";
      case "warning":
        return "bg-warning/20 text-warning";
      case "info":
        return "bg-primary/20 text-primary";
      default:
        return "bg-slate-600/20 text-slate-400";
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "risk_alert":
        return <Bell className="w-4 h-4" />;
      case "governance":
        return <MessageSquare className="w-4 h-4" />;
      case "validator_update":
        return <Settings className="w-4 h-4" />;
      default:
        return <Bell className="w-4 h-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-950">
      <Header 
        title="Notification Settings"
        subtitle="Configure alerts and manage your notification preferences"
      />

      <main className="p-6 space-y-6">
        {/* Settings Card */}
        <Card className="bg-slate-850 border-slate-800">
          <CardHeader>
            <CardTitle className="text-slate-50">Notification Preferences</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Email Notifications */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label className="text-slate-300">Email Notifications</Label>
                  <p className="text-sm text-slate-400">
                    Receive validator risk alerts and governance updates via email
                  </p>
                </div>
                <Switch
                  checked={emailNotifications}
                  onCheckedChange={setEmailNotifications}
                />
              </div>
              
              {emailNotifications && (
                <div className="pl-4 border-l-2 border-primary/20">
                  <Label htmlFor="email" className="text-slate-300">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    value={emailAddress}
                    onChange={(e) => setEmailAddress(e.target.value)}
                    className="bg-slate-900 border-slate-700 text-slate-50 placeholder-slate-400 focus:border-primary"
                    placeholder="your.email@example.com"
                  />
                </div>
              )}
            </div>

            {/* SMS Notifications */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label className="text-slate-300">SMS Notifications</Label>
                  <p className="text-sm text-slate-400">
                    Get critical validator alerts via SMS (Premium feature)
                  </p>
                </div>
                <Switch
                  checked={smsNotifications}
                  onCheckedChange={setSmsNotifications}
                />
              </div>
              
              {smsNotifications && (
                <div className="pl-4 border-l-2 border-primary/20">
                  <Label htmlFor="phone" className="text-slate-300">Phone Number</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className="bg-slate-900 border-slate-700 text-slate-50 placeholder-slate-400 focus:border-primary"
                    placeholder="+1 (555) 123-4567"
                  />
                  <Badge className="bg-warning/20 text-warning mt-2">
                    Premium Feature - Available in Q4 2025
                  </Badge>
                </div>
              )}
            </div>

            {/* Risk Threshold */}
            <div className="space-y-2">
              <Label className="text-slate-300">Risk Alert Threshold</Label>
              <Select value={riskThreshold} onValueChange={setRiskThreshold}>
                <SelectTrigger className="bg-slate-900 border-slate-700 text-slate-50">
                  <SelectValue placeholder="Select threshold" />
                </SelectTrigger>
                <SelectContent className="bg-slate-900 border-slate-700">
                  <SelectItem value="low">Low - All risk events</SelectItem>
                  <SelectItem value="medium">Medium - Warning and critical only</SelectItem>
                  <SelectItem value="high">High - Critical events only</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-sm text-slate-400">
                Choose how sensitive you want the risk alerts to be
              </p>
            </div>

            <Button 
              onClick={handleSaveSettings}
              className="bg-primary hover:bg-indigo-700 text-white"
            >
              <Check className="w-4 h-4 mr-2" />
              Save Settings
            </Button>
          </CardContent>
        </Card>

        {/* Recent Notifications */}
        <Card className="bg-slate-850 border-slate-800">
          <CardHeader>
            <CardTitle className="text-slate-50">Recent Notifications</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {notificationHistory.map((notification) => (
                <div 
                  key={notification.id}
                  className={`p-4 rounded-lg border border-slate-800 ${
                    notification.read ? "bg-slate-900" : "bg-slate-800"
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3">
                      <div className={`p-2 rounded-lg ${getSeverityColor(notification.severity)}`}>
                        {getTypeIcon(notification.type)}
                      </div>
                      <div>
                        <h4 className="font-medium text-slate-50">{notification.title}</h4>
                        <p className="text-sm text-slate-300 mt-1">{notification.message}</p>
                        <p className="text-xs text-slate-400 mt-2">
                          {notification.timestamp.toLocaleString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge className={getSeverityColor(notification.severity)}>
                        {notification.severity}
                      </Badge>
                      {!notification.read && (
                        <div className="w-2 h-2 bg-primary rounded-full"></div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Info Card */}
        <Card className="bg-slate-850 border-slate-800">
          <CardContent className="p-6">
            <div className="flex items-start space-x-3">
              <Mail className="w-5 h-5 text-primary mt-1" />
              <div>
                <h3 className="font-medium text-slate-50 mb-2">About Notifications</h3>
                <p className="text-slate-300 text-sm">
                  Stay informed about validator performance, governance proposals, and network events. 
                  Email notifications are available now, with SMS alerts coming in our Q4 2025 update.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}