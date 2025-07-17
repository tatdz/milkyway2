import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { Validator } from "@shared/schema";

interface AlertCardProps {
  validator: Validator;
}

export default function AlertCard({ validator }: AlertCardProps) {
  const getRiskColor = (type: string) => {
    switch (type) {
      case "good":
        return {
          border: "border-l-success",
          badge: "bg-success/20 text-success",
          dot: "bg-success",
          text: "Good"
        };
      case "neutral":
        return {
          border: "border-l-warning", 
          badge: "bg-warning/20 text-warning",
          dot: "bg-warning",
          text: "Neutral"
        };
      case "bad":
        return {
          border: "border-l-danger",
          badge: "bg-danger/20 text-danger", 
          dot: "bg-danger",
          text: "Bad"
        };
      default:
        return {
          border: "border-l-slate-600",
          badge: "bg-slate-600/20 text-slate-400",
          dot: "bg-slate-600", 
          text: "Unknown"
        };
    }
  };

  const risk = getRiskColor(validator.type);

  return (
    <Card className={`bg-slate-900 border-slate-800 border-l-4 ${risk.border}`}>
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-3">
            <div className={`w-2 h-2 ${risk.dot} rounded-full mt-2 ${validator.type === 'bad' ? 'animate-pulse' : ''}`}></div>
            <div>
              <h4 className="font-medium text-slate-50">{validator.stash}</h4>
              <p className="text-sm text-slate-300 mt-1">{validator.description}</p>
              <div className="flex items-center space-x-4 mt-2 text-xs text-slate-400">
                <span>{validator.eventsCount} events</span>
                <span>{new Date(validator.updatedAt).toLocaleDateString()}</span>
                <span>Commission: {validator.commission / 100}%</span>
                <span>Uptime: {validator.uptime}%</span>
              </div>
            </div>
          </div>
          <Badge className={risk.badge}>
            {risk.text}
          </Badge>
        </div>
        {validator.type !== 'good' && (
          <div className="mt-3 pt-3 border-t border-slate-800">
            <Button variant="outline" size="sm" className="text-slate-300 border-slate-600 hover:bg-slate-800">
              View suggested action
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
