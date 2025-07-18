import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { X, AlertTriangle, TrendingDown, Shield, ExternalLink } from "lucide-react";
import type { Validator } from "@shared/schema";

interface SuggestionModalProps {
  isOpen: boolean;
  onClose: () => void;
  validator: Validator;
}

export default function SuggestionModal({ isOpen, onClose, validator }: SuggestionModalProps) {
  const getSuggestions = (validator: Validator) => {
    const suggestions = [];
    
    if (validator.type === "bad") {
      if (validator.slashed) {
        suggestions.push({
          type: "critical",
          title: "Immediately Switch Validator",
          description: "This validator has been slashed. Move your nominations immediately to avoid further losses.",
          action: "Find alternative validators",
          icon: <AlertTriangle className="w-5 h-5" />
        });
      }
      
      if (validator.commission && validator.commission > 20) {
        suggestions.push({
          type: "warning",
          title: "High Commission Rate",
          description: `Commission rate of ${validator.commission}% is significantly above network average (5-10%).`,
          action: "Consider validators with <10% commission",
          icon: <TrendingDown className="w-5 h-5" />
        });
      }
      
      if (validator.uptime && validator.uptime < 85) {
        suggestions.push({
          type: "critical",
          title: "Poor Uptime Performance",
          description: `Uptime of ${validator.uptime}% indicates reliability issues that may affect rewards.`,
          action: "Switch to validators with >95% uptime",
          icon: <AlertTriangle className="w-5 h-5" />
        });
      }
    }
    
    if (validator.type === "neutral") {
      if (validator.commission && validator.commission > 10) {
        suggestions.push({
          type: "info",
          title: "Moderate Commission Rate",
          description: `Commission rate of ${validator.commission}% is above optimal range. Consider switching for better returns.`,
          action: "Look for validators with 5-10% commission",
          icon: <TrendingDown className="w-5 h-5" />
        });
      }
      
      suggestions.push({
        type: "info",
        title: "Monitor Performance",
        description: "This validator shows mixed performance signals. Regular monitoring is recommended.",
        action: "Set up notifications for performance changes",
        icon: <Shield className="w-5 h-5" />
      });
    }
    
    return suggestions;
  };

  const suggestions = getSuggestions(validator);
  
  const getSeverityColor = (type: string) => {
    switch (type) {
      case "critical":
        return "text-danger";
      case "warning":
        return "text-warning";
      case "info":
        return "text-primary";
      default:
        return "text-slate-400";
    }
  };

  const getSeverityBadge = (type: string) => {
    switch (type) {
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

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-slate-850 border-slate-800 text-slate-50 sm:max-w-2xl">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-slate-50">Suggested Actions</DialogTitle>
            <Button variant="ghost" size="sm" onClick={onClose} className="text-slate-400 hover:text-slate-200">
              <X className="w-5 h-5" />
            </Button>
          </div>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* Validator Info */}
          <div className="p-4 bg-slate-900 rounded-lg">
            <h4 className="font-medium text-slate-50 mb-2">Validator Details</h4>
            <div className="space-y-1 text-sm text-slate-300">
              <p><strong>Address:</strong> {validator.stash}</p>
              <p><strong>Commission:</strong> {validator.commission}%</p>
              <p><strong>Uptime:</strong> {validator.uptime}%</p>
              <p><strong>Status:</strong> {validator.slashed ? "Slashed" : "Active"}</p>
            </div>
          </div>

          {/* Suggestions */}
          <div className="space-y-3">
            <h4 className="font-medium text-slate-50">Recommended Actions</h4>
            {suggestions.length > 0 ? (
              suggestions.map((suggestion, index) => (
                <div key={index} className="p-4 bg-slate-900 rounded-lg border-l-4 border-slate-700">
                  <div className="flex items-start space-x-3">
                    <div className={`p-2 rounded-lg bg-slate-800 ${getSeverityColor(suggestion.type)}`}>
                      {suggestion.icon}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h5 className="font-medium text-slate-50">{suggestion.title}</h5>
                        <Badge className={getSeverityBadge(suggestion.type)}>
                          {suggestion.type}
                        </Badge>
                      </div>
                      <p className="text-slate-300 text-sm mb-2">{suggestion.description}</p>
                      <p className="text-slate-400 text-xs">
                        <strong>Action:</strong> {suggestion.action}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-4 bg-slate-900 rounded-lg text-center">
                <Shield className="w-8 h-8 text-success mx-auto mb-2" />
                <p className="text-slate-300">This validator appears to be performing well!</p>
                <p className="text-slate-400 text-sm mt-1">No specific actions required at this time.</p>
              </div>
            )}
          </div>

          {/* Additional Resources */}
          <div className="p-4 bg-slate-900 rounded-lg">
            <h4 className="font-medium text-slate-50 mb-3">Additional Resources</h4>
            <div className="space-y-2">
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full justify-between text-slate-300 border-slate-600 hover:bg-slate-800"
                onClick={() => window.open('https://polkadot.js.org/apps/#/staking', '_blank')}
              >
                <span>Polkadot Staking Dashboard</span>
                <ExternalLink className="w-4 h-4" />
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full justify-between text-slate-300 border-slate-600 hover:bg-slate-800"
                onClick={() => window.open('https://thousand-validators.kusama.network/', '_blank')}
              >
                <span>Thousand Validators Programme</span>
                <ExternalLink className="w-4 h-4" />
              </Button>
            </div>
          </div>

          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={onClose} className="text-slate-300 border-slate-600 hover:bg-slate-800">
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}