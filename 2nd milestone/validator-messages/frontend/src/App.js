import React, { useEffect, useState, useCallback } from 'react';
import { 
  Box, Container, Typography, CircularProgress, Snackbar, Alert, 
  Button, Tabs, Tab, Table, TableBody, TableCell, TableHead, TableRow, TableContainer, Paper, TextField, Chip, IconButton, Tooltip, Dialog, DialogTitle, DialogContent, DialogActions, Link
} from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import { ethers } from 'ethers';

import { fetchAllMessages, fetchNominatorMessages, fetchValidatorMessages, submitMessageToContract } from './contract';


const shortenAddress = (address) => {
  if (!address) return '';
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
};
const isValidEthereumAddress = (address) => {
  try { return ethers.isAddress(address); }
  catch { return false; }
};

export default function App() {
  const [account, setAccount] = useState('');
  const [chainId, setChainId] = useState('');
  const [isCorrectNetwork, setIsCorrectNetwork] = useState(false);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [activeTab, setActiveTab] = useState(0);
  const [formData, setFormData] = useState({ validator: '', content: '', era: '', txHash: '' });
  const [showNetworkDialog, setShowNetworkDialog] = useState(false);
  const [successTxHash, setSuccessTxHash] = useState('');

  // --------- Ethereum Init --------------
  const initEthereum = useCallback(async () => {
    if (!window.ethereum) {
      setError('MetaMask or injected wallet not found');
      return;
    }
    setLoading(true);
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const [addresses, chain] = await Promise.all([
        provider.send("eth_requestAccounts", []),
        provider.send("eth_chainId", [])
      ]);
      setAccount(addresses[0]);
      setChainId(chain);
      setIsCorrectNetwork(parseInt(chain, 16) === 11155111);
      setShowNetworkDialog(parseInt(chain, 16) !== 11155111);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    initEthereum();
    if (!window.ethereum) return;
    const handleAccountsChanged = (accs) => { setAccount(accs[0] || ''); };
    const handleChainChanged = (cid) => {
      setChainId(cid);
      const correct = parseInt(cid, 16) === 11155111;
      setIsCorrectNetwork(correct);
      setShowNetworkDialog(!correct);
    };
    window.ethereum.on('accountsChanged', handleAccountsChanged);
    window.ethereum.on('chainChanged', handleChainChanged);
    return () => {
      window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
      window.ethereum.removeListener('chainChanged', handleChainChanged);
    };
  }, [initEthereum]);

  // --------- Load Messages --------------
  const doLoadMessages = useCallback(async () => {
    setLoading(true); setError('');
    try {
      let loaded = [];
      if (activeTab === 0) loaded = await fetchAllMessages();
      else if (activeTab === 1 && account) loaded = await fetchNominatorMessages(account);
      else if (activeTab === 2 && formData.validator) loaded = await fetchValidatorMessages(formData.validator);
      setMessages(loaded);
    } catch (err) {
      setError(err?.message || 'Failed to load messages');
      setMessages([]);
    }
    setLoading(false);
  }, [activeTab, account, formData.validator]);

  useEffect(() => { doLoadMessages(); }, [activeTab, account, isCorrectNetwork, doLoadMessages]);

  // --------- Switch Network --------------
  const switchToSepolia = async () => {
    try {
      setLoading(true);
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: '0xaa36a7' }]
      });
      setIsCorrectNetwork(true); setShowNetworkDialog(false);
    } catch {
      setError('Failed to switch network. Please switch to Sepolia manually.');
    }
    setLoading(false);
  };

  // --------- Message Submission --------------
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); setError('');
    try {
      if (!account) throw new Error('Connect your wallet');
      if (!isCorrectNetwork) throw new Error('Switch to Sepolia');
      if (!formData.validator) throw new Error('Validator required');
      if (!isValidEthereumAddress(formData.validator)) throw new Error('Validator address invalid');
      if (!formData.content.trim()) throw new Error('Message required');
      if (formData.era && isNaN(Number(formData.era))) throw new Error('Era must be a number');
      const tx = await submitMessageToContract({
        validator: formData.validator,
        content: formData.content,
        era: formData.era,
        txHash: formData.txHash ? formData.txHash : undefined
      });
      setSuccess('Message submitted!'); setSuccessTxHash(tx.hash);
      setFormData({ validator: '', content: '', era: '', txHash: '' });
      setTimeout(doLoadMessages, 3000); // reload after tx
    } catch (err) {
      setError(err?.message || 'Submit failed');
    }
    setLoading(false);
  };

  const handleTabChange = (_, v) => { setActiveTab(v); setMessages([]); };
  const handleInputChange = (e) => { setFormData(f => ({ ...f, [e.target.name]: e.target.value })); };

  const copyToClipboard = (txt) => {
    if (!txt) return;
    navigator.clipboard.writeText(txt); setSuccess('Copied to clipboard!');
  };

  // --------- UI Start --------------
  if (!account) {
    return (
      <Container>
        <Box sx={{ py: 12, textAlign: 'center' }}>
          <Typography variant="h4" sx={{ mb: 2 }}>Validator Messaging DApp</Typography>
          <Button variant="contained" color="primary" onClick={initEthereum}>Connect Wallet</Button>
          {loading && <CircularProgress sx={{ mt: 3 }} />}
          {error && <Alert severity="error" sx={{ mt: 3 }}>{error}</Alert>}
          {!window.ethereum && <Typography sx={{ mt: 2 }}>Install MetaMask or compatible wallet</Typography>}
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom>Validator Messaging System</Typography>
        <Typography variant="subtitle1" color="text.secondary">
          Secure communication with blockchain validators
        </Typography>
      </Box>
      <Box sx={{ mb: 4, p: 2, borderRadius: 1, bgcolor: account ? 'success.light' : 'error.light', color: 'common.white', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Typography variant="body1">
            Connected: {shortenAddress(account)}
            <Tooltip title="Copy address">
              <IconButton size="small" sx={{ color: 'common.white', ml: 1 }} onClick={() => copyToClipboard(account)}>
                <ContentCopyIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </Typography>
        </Box>
        <Chip label={isCorrectNetwork ? "Sepolia Network" : "Wrong Network"} color={isCorrectNetwork ? "success" : "error"} sx={{ color: 'common.white' }} variant="outlined" />
      </Box>
      <Dialog open={showNetworkDialog} onClose={() => setShowNetworkDialog(false)}>
        <DialogTitle>Wrong Network</DialogTitle>
        <DialogContent>
          <Typography>Please switch to the Sepolia test network to use this application.</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowNetworkDialog(false)}>Cancel</Button>
          <Button onClick={switchToSepolia} variant="contained" disabled={loading}>{loading ? "Switching..." : "Switch to Sepolia"}</Button>
        </DialogActions>
      </Dialog>
      <Tabs value={activeTab} onChange={handleTabChange} variant="fullWidth" sx={{ mb: 4 }}>
        <Tab label="All Messages" />
        <Tab label="My Messages" />
        <Tab label="Filter by Validator" />
      </Tabs>
      {activeTab === 2 && (
        <Box sx={{ mb: 4 }}>
          <TextField
            name="validator"
            label="Validator Address"
            placeholder="0x..."
            fullWidth
            value={formData.validator}
            onChange={handleInputChange}
            error={!!formData.validator && !isValidEthereumAddress(formData.validator)}
            helperText={formData.validator && !isValidEthereumAddress(formData.validator) ? "Invalid Ethereum address" : ""}
            InputProps={{
              endAdornment: formData.validator && (
                <Button size="small" onClick={doLoadMessages} disabled={!isValidEthereumAddress(formData.validator)}>Filter</Button>
              )
            }}
          />
        </Box>
      )}
      <Box component="form" onSubmit={handleSubmit} sx={{ mb: 4, p: 3, border: 1, borderColor: 'divider', borderRadius: 1, bgcolor: 'background.paper' }}>
        <Typography variant="h6" gutterBottom>Submit New Message</Typography>
        <TextField
          name="validator"
          label="Validator Address"
          placeholder="0x..."
          fullWidth
          required
          sx={{ mb: 2 }}
          value={formData.validator}
          onChange={handleInputChange}
          error={!!formData.validator && !isValidEthereumAddress(formData.validator)}
          helperText={formData.validator && !isValidEthereumAddress(formData.validator) ? "Invalid Ethereum address" : ""}
        />
        <TextField name="content" label="Message Content" fullWidth multiline rows={4} required sx={{ mb: 2 }} value={formData.content} onChange={handleInputChange} />
        <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
          <TextField name="era" label="Era Number" type="number" sx={{ width: 120 }} value={formData.era} onChange={handleInputChange} />
          <TextField name="txHash" label="Transaction Hash (Optional)" placeholder="0x..." sx={{ flexGrow: 1 }} value={formData.txHash} onChange={handleInputChange} />
        </Box>
        <Button type="submit" variant="contained" size="large" fullWidth disabled={loading || !account || !isCorrectNetwork} startIcon={loading ? <CircularProgress size={24} /> : null}>
          {loading ? "Processing..." : "Submit Message"}
        </Button>
      </Box>
      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
          <CircularProgress />
          <Typography sx={{ ml: 2 }}>Loading messages...</Typography>
        </Box>
      )}
      <TableContainer component={Paper} sx={{ mb: 4 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Validator</TableCell>
              <TableCell>Nominator</TableCell>
              <TableCell>Message</TableCell>
              <TableCell>Era</TableCell>
              <TableCell>Transaction</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {messages.length > 0 ? (
              messages.map((msg, idx) => (
                <TableRow key={idx}>
                  <TableCell sx={{ fontFamily: 'monospace' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      {shortenAddress(msg.validator)}
                      <Tooltip title="Copy address">
                        <IconButton size="small" onClick={() => copyToClipboard(msg.validator)}>
                          <ContentCopyIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </TableCell>
                  <TableCell sx={{ fontFamily: 'monospace' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      {shortenAddress(msg.nominator)}
                      <Tooltip title="Copy address">
                        <IconButton size="small" onClick={() => copyToClipboard(msg.nominator)}>
                          <ContentCopyIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </TableCell>
                  <TableCell>{msg.content}</TableCell>
                  <TableCell>{msg.era}</TableCell>
                  <TableCell>
                    {msg.txUrl ? (
                      <Link href={msg.txUrl} target="_blank" rel="noopener noreferrer" sx={{ display: 'flex', alignItems: 'center' }}>
                        View <OpenInNewIcon fontSize="small" sx={{ ml: 0.5 }} />
                      </Link>
                    ) : "--"}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} align="center" sx={{ py: 4 }}>
                  <Typography color="text.secondary">
                    {error ? 'Error loading messages' : 'No messages found'}
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <Snackbar open={!!error} autoHideDuration={6000} onClose={() => setError("")} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
        <Alert severity="error" onClose={() => setError("")}>{error}</Alert>
      </Snackbar>
      <Snackbar open={!!success} autoHideDuration={6000} onClose={() => { setSuccess(""); setSuccessTxHash(""); }} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
        <Alert severity="success" onClose={() => { setSuccess(""); setSuccessTxHash(""); }}>
          {success} {successTxHash && (
            <Link href={`https://sepolia.etherscan.io/tx/${successTxHash}`} target="_blank" rel="noopener noreferrer" sx={{ ml: 1, color: 'inherit', textDecoration: 'underline' }}>View</Link>
          )}
        </Alert>
      </Snackbar>
    </Container>
  );
}
