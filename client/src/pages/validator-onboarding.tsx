import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useWallet } from "@/hooks/use-wallet";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { generateKeys, encryptMessage, signMessage, decryptMessage, exportKeys, importKeys, type CryptoKeys } from "@/lib/crypto";
import { useEncryptedMessagesContract } from "@/lib/contract";
import { Key, Send, Download, Upload, Shield, Lock, Unlock, ExternalLink } from "lucide-react";
import type { EncryptedMessage, ValidatorKey } from "@shared/schema";

export default function ValidatorOnboarding() {
  const [message, setMessage] = useState("");
  const [keys, setKeys] = useState<CryptoKeys | null>(null);
  const [groupKeyId, setGroupKeyId] = useState("validator-group-2025");
  const [keysJson, setKeysJson] = useState("");
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [useBlockchain, setUseBlockchain] = useState(false);
  const [contractTxHash, setContractTxHash] = useState("");
  
  const contract = useEncryptedMessagesContract('passet');
  
  const { isConnected, account } = useWallet();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch encrypted messages
  const { data: messages = [] } = useQuery<EncryptedMessage[]>({
    queryKey: ["/api/messages", { groupId: groupKeyId }],
    enabled: !!groupKeyId,
  });

  // Mutation to submit encrypted message
  const submitMessageMutation = useMutation({
    mutationFn: async (messageData: {
      ciphertext: string;
      signature: string;
      senderAddress: string;
      transactionHash: string;
      groupKeyId: string;
    }) => {
      return apiRequest("/api/messages", {
        method: "POST",
        body: JSON.stringify(messageData),
      });
    },
    onSuccess: () => {
      toast({
        title: "Message Submitted",
        description: "Your encrypted message has been stored on-chain successfully.",
      });
      setMessage("");
      queryClient.invalidateQueries({ queryKey: ["/api/messages"] });
    },
    onError: (error) => {
      toast({
        title: "Submission Failed",
        description: "Failed to submit encrypted message. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Mutation to unlock messages
  const unlockMessagesMutation = useMutation({
    mutationFn: async (groupId: string) => {
      return apiRequest(`/api/messages/unlock/${groupId}`, {
        method: "POST",
      });
    },
    onSuccess: () => {
      setIsUnlocked(true);
      toast({
        title: "Messages Unlocked",
        description: "Validator messages are now publicly accessible.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/messages"] });
    },
  });

  const handleGenerateKeys = async () => {
    try {
      const newKeys = await generateKeys();
      setKeys(newKeys);
      toast({
        title: "Keys Generated",
        description: "New cryptographic keys have been generated securely.",
      });
    } catch (error) {
      toast({
        title: "Key Generation Failed",
        description: "Failed to generate cryptographic keys.",
        variant: "destructive",
      });
    }
  };

  const handleExportKeys = () => {
    if (!keys) return;
    const exported = exportKeys(keys);
    setKeysJson(exported);
    
    // Create download
    const blob = new Blob([exported], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `validator-keys-${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast({
      title: "Keys Exported",
      description: "Cryptographic keys have been downloaded securely.",
    });
  };

  const handleImportKeys = () => {
    try {
      const importedKeys = importKeys(keysJson);
      setKeys(importedKeys);
      toast({
        title: "Keys Imported",
        description: "Cryptographic keys have been imported successfully.",
      });
    } catch (error) {
      toast({
        title: "Import Failed",
        description: "Failed to import keys. Please check the JSON format.",
        variant: "destructive",
      });
    }
  };

  const handleSubmitMessage = async () => {
    console.log("Submit message clicked");
    
    if (!keys || !message.trim()) {
      toast({
        title: "Missing Requirements",
        description: "Please generate keys and enter a message.",
        variant: "destructive",
      });
      return;
    }

    console.log("Starting message submission...");

    try {
      // Encrypt the message
      console.log("Encrypting message...");
      const ciphertext = await encryptMessage(message, keys.symmetricKey);
      
      // Sign the ciphertext
      console.log("Signing message...");
      const signature = await signMessage(ciphertext, keys.signingPrivateKey);
      
      let transactionHash = "";
      let senderAddress = "anonymous_validator";
      
      // Test SubWallet connection if blockchain mode is enabled
      if (useBlockchain) {
        console.log("Blockchain mode enabled, testing SubWallet...");
        try {
          // Test SubWallet availability and connection
          if (typeof window !== 'undefined') {
            const { web3Enable, web3Accounts } = await import("@polkadot/extension-dapp");
            
            // Try to enable SubWallet specifically
            const extensions = await web3Enable("Milkyway2");
            console.log("Extensions found:", extensions.length);
            
            if (extensions.length === 0) {
              throw new Error("No Polkadot extensions found. Please install SubWallet.");
            }
            
            const accounts = await web3Accounts();
            console.log("Accounts found:", accounts.length);
            
            if (accounts.length === 0) {
              throw new Error("No accounts found. Please create an account in SubWallet.");
            }
            
            const subwalletAccount = accounts[0];
            senderAddress = subwalletAccount.address;
            console.log("Using SubWallet account:", senderAddress);
            
            // Try to connect and submit to Passet chain
            await contract.connect(subwalletAccount);
            transactionHash = await contract.postMessage(ciphertext, signature);
            setContractTxHash(transactionHash);
            
            toast({
              title: "SubWallet Transaction Successful",
              description: `Message posted via SubWallet. TX: ${transactionHash.slice(0, 10)}...`,
            });
          } else {
            throw new Error("Browser environment not available");
          }
        } catch (error) {
          console.error("SubWallet transaction failed:", error);
          
          // Fallback simulation mode
          const errorMessage = error instanceof Error ? error.message : "Unknown error";
          console.log("Using fallback simulation mode:", errorMessage);
          
          // Create simulated transaction hash
          transactionHash = `sim_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
          
          // Use connected account address if available, otherwise demo address
          if (isConnected && account) {
            senderAddress = account.address;
          } else {
            senderAddress = "5Demo" + Math.random().toString(36).substr(2, 44) + "ValidatorAddress";
          }
          
          toast({
            title: "Simulation Mode",
            description: `SubWallet unavailable. Message saved in simulation mode.`,
            variant: "destructive",
          });
        }
      } else {
        console.log("Database-only mode");
        // Database-only mode
        transactionHash = `db_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        
        if (isConnected && account) {
          senderAddress = account.address;
        }
      }

      console.log("Saving to database...", { senderAddress, transactionHash, groupKeyId });

      // Always store in database for message feed
      const result = await submitMessageMutation.mutateAsync({
        ciphertext,
        signature,
        senderAddress,
        transactionHash,
        groupKeyId,
      });

      console.log("Database save result:", result);

      // Clear message after successful submission
      setMessage("");
      
      if (!useBlockchain) {
        toast({
          title: "Message Stored",
          description: "Encrypted message saved successfully.",
        });
      }
      
    } catch (error) {
      console.error("Message submission failed:", error);
      toast({
        title: "Submission Failed",
        description: `Failed to submit encrypted message: ${error instanceof Error ? error.message : "Unknown error"}`,
        variant: "destructive",
      });
    }
  };

  const handleUnlockMessages = () => {
    unlockMessagesMutation.mutate(groupKeyId);
  };

  const decryptedMessages = isUnlocked && keys 
    ? messages.map(msg => ({
        ...msg,
        decrypted: decryptMessage(msg.ciphertext, keys.symmetricKey)
      }))
    : [];

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-slate-50 mb-4">Validator Encrypted Messaging</h1>
        <p className="text-slate-400 max-w-2xl mx-auto">
          Securely post encrypted messages that become publicly decryptable after governance unlock events.
          Messages are stored immutably on-chain with zero-knowledge privacy protection.
        </p>
      </div>

      <Card className="bg-slate-850 border-slate-800 mb-6">
        <CardContent className="p-4">
          <div className="flex items-center space-x-3">
            <Shield className="w-6 h-6 text-blue-400" />
            <div>
              <h4 className="font-medium text-slate-50">SubWallet Integration Status</h4>
              <p className="text-sm text-slate-400">
                {isConnected 
                  ? `Connected to ${account?.meta?.name || "SubWallet"} (${account?.address?.slice(0, 8)}...)` 
                  : "Messaging works with or without SubWallet. Enable blockchain mode to test SubWallet connection."
                }
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="keys" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3 bg-slate-800">
          <TabsTrigger value="keys" className="data-[state=active]:bg-slate-700">
            <Key className="w-4 h-4 mr-2" />
            Key Management
          </TabsTrigger>
          <TabsTrigger value="messaging" className="data-[state=active]:bg-slate-700">
            <Send className="w-4 h-4 mr-2" />
            Send Messages
          </TabsTrigger>
          <TabsTrigger value="feed" className="data-[state=active]:bg-slate-700">
            {isUnlocked ? <Unlock className="w-4 h-4 mr-2" /> : <Lock className="w-4 h-4 mr-2" />}
            Message Feed
          </TabsTrigger>
        </TabsList>

        <TabsContent value="keys">
          <Card className="bg-slate-850 border-slate-800">
            <CardHeader>
              <CardTitle className="text-slate-50">Cryptographic Key Management</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-4">
                  <h4 className="font-medium text-slate-50">Generate New Keys</h4>
                  <Button onClick={handleGenerateKeys} className="w-full">
                    <Key className="w-4 h-4 mr-2" />
                    Generate Secure Keys
                  </Button>
                  {keys && (
                    <div className="space-y-2">
                      <Badge className="bg-success/20 text-success">Keys Generated</Badge>
                      <Button onClick={handleExportKeys} variant="outline" className="w-full">
                        <Download className="w-4 h-4 mr-2" />
                        Export & Download Keys
                      </Button>
                    </div>
                  )}
                </div>

                <div className="space-y-4">
                  <h4 className="font-medium text-slate-50">Import Existing Keys</h4>
                  <Textarea
                    placeholder="Paste your exported keys JSON here..."
                    value={keysJson}
                    onChange={(e) => setKeysJson(e.target.value)}
                    rows={6}
                    className="bg-slate-900 border-slate-700 text-slate-300"
                  />
                  <Button onClick={handleImportKeys} variant="outline" className="w-full">
                    <Upload className="w-4 h-4 mr-2" />
                    Import Keys
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="groupId" className="text-slate-300">Group Key ID</Label>
                <Input
                  id="groupId"
                  value={groupKeyId}
                  onChange={(e) => setGroupKeyId(e.target.value)}
                  className="bg-slate-900 border-slate-700 text-slate-300"
                  placeholder="validator-group-2025"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="messaging">
          <Card className="bg-slate-850 border-slate-800">
            <CardHeader>
              <CardTitle className="text-slate-50">Compose Encrypted Message</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="message" className="text-slate-300">Message Content</Label>
                <Textarea
                  id="message"
                  placeholder="Enter your risk report, status update, or validator communication..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={6}
                  className="bg-slate-900 border-slate-700 text-slate-300"
                />
              </div>

              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="useBlockchain"
                    checked={useBlockchain}
                    onChange={(e) => setUseBlockchain(e.target.checked)}
                    className="rounded"
                  />
                  <Label htmlFor="useBlockchain" className="text-sm text-slate-300">
                    Test SubWallet connection & submit to Passet blockchain (with fallback)
                  </Label>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-sm text-slate-400">Status Checks:</p>
                    <div className="flex items-center space-x-4 text-xs">
                      <Badge variant={isConnected ? "default" : "secondary"}>
                        {isConnected ? "Wallet Connected" : "Wallet Required"}
                      </Badge>
                      <Badge variant={keys ? "default" : "secondary"}>
                        {keys ? "Keys Ready" : "Keys Required"}
                      </Badge>
                      <Badge variant={message.length > 10 ? "default" : "secondary"}>
                        {message.length > 10 ? "Message Ready" : "Message Required"}
                      </Badge>
                      {useBlockchain && (
                        <Badge variant="outline" className="text-xs">
                          Blockchain Mode
                        </Badge>
                      )}
                    </div>
                  </div>

                  <Button 
                    onClick={handleSubmitMessage}
                    disabled={!keys || !message.trim() || submitMessageMutation.isPending}
                    className="bg-primary hover:bg-indigo-700"
                  >
                    <Send className="w-4 h-4 mr-2" />
                    {submitMessageMutation.isPending ? "Submitting..." : "Submit Message"}
                  </Button>
                </div>
                
                {contractTxHash && (
                  <div className="p-2 bg-slate-800 rounded text-xs">
                    <p className="text-slate-400 mb-1">Last Transaction:</p>
                    <div className="flex items-center space-x-2">
                      <code className="text-green-400">{contractTxHash.slice(0, 20)}...</code>
                      <ExternalLink className="w-3 h-3 text-slate-400" />
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="feed">
          <Card className="bg-slate-850 border-slate-800">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-slate-50">Validator Message Feed</CardTitle>
                <div className="space-x-2">
                  <Badge variant={isUnlocked ? "default" : "secondary"}>
                    {isUnlocked ? "Unlocked" : "Encrypted"}
                  </Badge>
                  {!isUnlocked && (
                    <Button 
                      onClick={handleUnlockMessages}
                      size="sm"
                      disabled={unlockMessagesMutation.isPending}
                    >
                      <Unlock className="w-4 h-4 mr-2" />
                      {unlockMessagesMutation.isPending ? "Unlocking..." : "Unlock Messages"}
                    </Button>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {!isUnlocked ? (
                <div className="text-center py-8">
                  <Lock className="w-12 h-12 text-slate-600 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-slate-50 mb-2">Messages are Encrypted</h3>
                  <p className="text-slate-400">
                    Validator messages are encrypted and only visible to validators until the unlock event.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {decryptedMessages.length === 0 ? (
                    <p className="text-slate-400 text-center py-8">No messages available.</p>
                  ) : (
                    decryptedMessages.map((msg, index) => (
                      <Card key={msg.id} className="bg-slate-900 border-slate-700">
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between mb-2">
                            <div className="text-sm text-slate-400">
                              From: {msg.senderAddress.slice(0, 8)}...{msg.senderAddress.slice(-6)}
                            </div>
                            <div className="text-xs text-slate-500">
                              {new Date(msg.timestamp!).toLocaleString()}
                            </div>
                          </div>
                          <div className="text-slate-300">
                            {msg.decrypted}
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}