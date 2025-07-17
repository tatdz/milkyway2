import { useState, useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Shield, X, Loader2 } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useWallet } from "@/hooks/use-wallet";

interface ZKReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  validatorStash?: string;
}

export default function ZKReportModal({ isOpen, onClose, validatorStash = "" }: ZKReportModalProps) {
  const [formData, setFormData] = useState({
    validatorStash: validatorStash,
    incidentType: "",
    description: "",
  });
  const [isGeneratingProof, setIsGeneratingProof] = useState(false);
  const { isConnected, account } = useWallet();
  const { toast } = useToast();

  // Update form data when validatorStash prop changes
  useEffect(() => {
    setFormData(prev => ({
      ...prev,
      validatorStash: validatorStash || prev.validatorStash
    }));
  }, [validatorStash]);
  const queryClient = useQueryClient();

  const submitReportMutation = useMutation({
    mutationFn: async (data: any) => {
      return apiRequest("POST", "/api/reports", data);
    },
    onSuccess: () => {
      toast({
        title: "Report Submitted",
        description: "Your anonymous report has been submitted successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/reports"] });
      onClose();
      setFormData({ validatorStash: "", incidentType: "", description: "" });
    },
    onError: () => {
      toast({
        title: "Submission Failed", 
        description: "Failed to submit the report. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.validatorStash || !formData.incidentType) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    setIsGeneratingProof(true);
    
    try {
      // Check wallet connection first
      if (!isConnected || !account) {
        toast({
          title: "Wallet Not Connected",
          description: "Please connect your wallet to submit a report.",
          variant: "destructive",
        });
        return;
      }

      // Simulate ZK proof generation
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Generate a mock nullifier hash
      const nullifierHash = `0x${Math.random().toString(16).substr(2, 64)}`;
      
      const reportData = {
        validatorStash: formData.validatorStash,
        incidentType: formData.incidentType,
        description: formData.description,
        nullifierHash,
        proof: {
          // Mock proof data - in real implementation this would be from Semaphore
          mock: true,
          timestamp: Date.now(),
        },
      };

      await submitReportMutation.mutateAsync(reportData);
    } catch (error) {
      console.error("ZK proof generation failed:", error);
      toast({
        title: "Proof Generation Failed",
        description: "Failed to generate zero-knowledge proof. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGeneratingProof(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-slate-850 border-slate-800 text-slate-50 sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-slate-50">Submit Anonymous Report</DialogTitle>
            <Button variant="ghost" size="sm" onClick={onClose} className="text-slate-400 hover:text-slate-200">
              <X className="w-5 h-5" />
            </Button>
          </div>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="validatorStash" className="text-slate-300">
              Validator Address *
            </Label>
            <Input
              id="validatorStash"
              type="text"
              value={formData.validatorStash}
              onChange={(e) => handleInputChange("validatorStash", e.target.value)}
              className="bg-slate-900 border-slate-700 text-slate-50 placeholder-slate-400 focus:border-primary"
              placeholder="5F3sa2TJAe..."
              required
            />
          </div>
          
          <div>
            <Label htmlFor="incidentType" className="text-slate-300">
              Incident Type *
            </Label>
            <Select value={formData.incidentType} onValueChange={(value) => handleInputChange("incidentType", value)}>
              <SelectTrigger className="bg-slate-900 border-slate-700 text-slate-50">
                <SelectValue placeholder="Select incident type" />
              </SelectTrigger>
              <SelectContent className="bg-slate-900 border-slate-700">
                <SelectItem value="Offline/Unresponsive">Offline/Unresponsive</SelectItem>
                <SelectItem value="Slash Event">Slash Event</SelectItem>
                <SelectItem value="Governance Violation">Governance Violation</SelectItem>
                <SelectItem value="Other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label htmlFor="description" className="text-slate-300">
              Description
            </Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              className="bg-slate-900 border-slate-700 text-slate-50 placeholder-slate-400 focus:border-primary"
              rows={3}
              placeholder="Describe the incident..."
            />
          </div>
          
          <div className="bg-slate-900 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <Shield className="w-4 h-4 text-purple-400" />
              <span className="text-sm font-medium text-purple-400">Privacy Protection</span>
            </div>
            <p className="text-xs text-slate-400">
              Your identity will be completely anonymous. This report uses zero-knowledge proofs to verify 
              authenticity without revealing your identity.
            </p>
          </div>
          
          <div className="flex space-x-3 pt-4">
            <Button 
              type="button"
              variant="outline"
              className="flex-1 bg-slate-700 border-slate-600 text-slate-300 hover:bg-slate-600"
              onClick={onClose}
              disabled={isGeneratingProof}
            >
              Cancel
            </Button>
            <Button 
              type="submit"
              className="flex-1 bg-purple-600 hover:bg-purple-700 text-white"
              disabled={isGeneratingProof || submitReportMutation.isPending}
            >
              {isGeneratingProof ? "Generating Proof..." : "Generate ZK Proof"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
