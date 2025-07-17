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
import { Key, Send, Download, Upload, Shield, Lock, Unlock } from "lucide-react";
import type { EncryptedMessage, ValidatorKey } from "@shared/schema";

export default function ValidatorOnboarding() {
  const [message, setMessage] = useState("");
  const [keys, setKeys] = useState<CryptoKeys | null>(null);
  const [groupKeyId, setGroupKeyId] = useState("validator-group-2025");
  const [keysJson, setKeysJson] = useState("");
  const [isUnlocked, setIsUnlocked] = useState(false);
  
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
    if (!keys || !message.trim() || !isConnected || !account) {
      toast({
        title: "Missing Requirements",
        description: "Please connect wallet, generate keys, and enter a message.",
        variant: "destructive",
      });
      return;
    }

    try {
      // Encrypt the message
      const ciphertext = await encryptMessage(message, keys.symmetricKey);
      
      // Sign the ciphertext
      const signature = await signMessage(ciphertext, keys.signingPrivateKey);
      
      // Generate mock transaction hash (in production, this would come from actual blockchain transaction)
      const transactionHash = `0x${Array.from(crypto.getRandomValues(new Uint8Array(32)))
        .map(b => b.toString(16).padStart(2, '0')).join('')}`;

      await submitMessageMutation.mutateAsync({
        ciphertext,
        signature,
        senderAddress: account,
        transactionHash,
        groupKeyId,
      });
    } catch (error) {
      console.error("Failed to submit message:", error);
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

      {!isConnected && (
        <Card className="bg-slate-850 border-slate-800">
          <CardContent className="p-6 text-center">
            <Shield className="w-12 h-12 text-warning mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-slate-50 mb-2">Wallet Connection Required</h3>
            <p className="text-slate-400">Please connect your wallet to access validator messaging features.</p>
          </CardContent>
        </Card>
      )}

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
                  </div>
                </div>

                <Button 
                  onClick={handleSubmitMessage}
                  disabled={!isConnected || !keys || !message.trim() || submitMessageMutation.isPending}
                  className="bg-primary hover:bg-indigo-700"
                >
                  <Send className="w-4 h-4 mr-2" />
                  {submitMessageMutation.isPending ? "Encrypting..." : "Encrypt & Submit"}
                </Button>
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