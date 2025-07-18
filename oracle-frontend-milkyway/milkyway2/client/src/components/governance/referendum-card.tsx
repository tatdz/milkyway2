import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Referendum } from "@shared/schema";

interface ReferendumCardProps {
  referendum: Referendum;
}

export default function ReferendumCard({ referendum }: ReferendumCardProps) {
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "confirming":
        return "bg-success/20 text-success";
      case "deciding":
        return "bg-warning/20 text-warning";
      case "submitted":
        return "bg-primary/20 text-primary";
      default:
        return "bg-slate-600/20 text-slate-400";
    }
  };

  const getSupportColor = (support: number) => {
    if (support >= 60) return "bg-success";
    if (support >= 40) return "bg-warning"; 
    return "bg-primary";
  };

  return (
    <Card className="bg-slate-900 border-slate-800">
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div>
            <h4 className="font-medium text-slate-50">{referendum.title}</h4>
            <p className="text-xs text-slate-400">{referendum.track}</p>
          </div>
          <Badge className={getStatusColor(referendum.status)}>
            {referendum.status}
          </Badge>
        </div>
        
        <p className="text-sm text-slate-300 mb-4 line-clamp-2">{referendum.description}</p>
        
        <div className="space-y-2 mb-4">
          <div className="flex justify-between text-xs">
            <span className="text-slate-400">Support</span>
            <span className="text-slate-50">{referendum.support}%</span>
          </div>
          <div className="w-full bg-slate-800 rounded-full h-2">
            <div 
              className={`${getSupportColor(referendum.support)} h-2 rounded-full transition-all`}
              style={{ width: `${referendum.support}%` }}
            ></div>
          </div>
        </div>
        
        <div className="flex items-center justify-between text-xs text-slate-400">
          <span>{referendum.timeLeft}</span>
          <span>{referendum.totalVotes}</span>
        </div>
      </CardContent>
    </Card>
  );
}
