import Header from "@/components/layout/header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ExternalLink, Shield, Users, AlertTriangle, CheckCircle } from "lucide-react";

export default function Documentation() {
  return (
    <div className="min-h-screen bg-slate-950">
      <Header 
        title="Documentation"
        subtitle="Complete guide to Milkyway2's validator monitoring and encrypted messaging for Polkadot, Kusama, and parachains"
      />

      <main className="p-6 space-y-6">
        {/* Mission Section */}
        <Card className="bg-slate-850 border-slate-800">
          <CardHeader>
            <CardTitle className="text-slate-50">Mission</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-slate-300">
              Milkyway2 is a decentralized Web3 application designed for transparent, privacy-preserving validator 
              incident and risk reporting across Polkadot, Kusama, and parachains. Our platform combines real-time 
              validator monitoring with zero-knowledge anonymous reporting and secure encrypted messaging to ensure 
              network security and transparency for both users and validators.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-slate-900 rounded-lg">
                <h4 className="font-semibold text-slate-50 mb-2">Real-time Monitoring</h4>
                <p className="text-slate-300 text-sm">
                  Continuous tracking of validator performance, governance participation, and network events.
                </p>
              </div>
              <div className="p-4 bg-slate-900 rounded-lg">
                <h4 className="font-semibold text-slate-50 mb-2">Privacy-First Reporting</h4>
                <p className="text-slate-300 text-sm">
                  Anonymous incident reporting using Semaphore zero-knowledge proofs for complete privacy.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* User Flow Section */}
        <Card className="bg-slate-850 border-slate-800">
          <CardHeader>
            <CardTitle className="text-slate-50">User Flow - Network Monitoring</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-slate-300 mb-4">
              Milkyway2 implements a "one-human-one-signal" model for Sybil-resistant reporting:
            </p>
            <div className="space-y-4">
              <div className="flex items-start space-x-4 p-4 bg-slate-900 rounded-lg">
                <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center text-primary font-bold text-sm">1</div>
                <div>
                  <h4 className="font-semibold text-slate-50">Connect Wallet</h4>
                  <p className="text-slate-300 text-sm">User connects SubWallet or Polkadot.js extension to authenticate their identity.</p>
                </div>
              </div>
              <div className="flex items-start space-x-4 p-4 bg-slate-900 rounded-lg">
                <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center text-primary font-bold text-sm">2</div>
                <div>
                  <h4 className="font-semibold text-slate-50">Discover Risk Event</h4>
                  <p className="text-slate-300 text-sm">User sees/unlocks "Attest/Report" button on any validator risk event in the dashboard.</p>
                </div>
              </div>
              <div className="flex items-start space-x-4 p-4 bg-slate-900 rounded-lg">
                <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center text-primary font-bold text-sm">3</div>
                <div>
                  <h4 className="font-semibold text-slate-50">Generate ZK Proof</h4>
                  <p className="text-slate-300 text-sm">ZK in-browser proof ensures they haven't already reported on this specific event (nullifier prevention).</p>
                </div>
              </div>
              <div className="flex items-start space-x-4 p-4 bg-slate-900 rounded-lg">
                <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center text-primary font-bold text-sm">4</div>
                <div>
                  <h4 className="font-semibold text-slate-50">Smart Contract Verification</h4>
                  <p className="text-slate-300 text-sm">Smart contract blocks duplicate attempts - no double-voting, no Sybil attacks.</p>
                </div>
              </div>
              <div className="flex items-start space-x-4 p-4 bg-slate-900 rounded-lg">
                <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center text-primary font-bold text-sm">5</div>
                <div>
                  <h4 className="font-semibold text-slate-50">Signal Logging</h4>
                  <p className="text-slate-300 text-sm">Optionally, signal is logged to the event feed and visible to DAO/governance for collective decision making.</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Validator Flow Section */}
        <Card className="bg-slate-850 border-slate-800">
          <CardHeader>
            <CardTitle className="text-slate-50">Validator Flow - Encrypted Messaging</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-slate-300 mb-4">
              Validators can securely communicate about network incidents and coordinate risk response:
            </p>
            <div className="space-y-4">
              <div className="flex items-start space-x-4 p-4 bg-slate-900 rounded-lg">
                <div className="w-8 h-8 bg-purple-600/20 rounded-full flex items-center justify-center text-purple-400 font-bold text-sm">1</div>
                <div>
                  <h4 className="font-semibold text-slate-50">Connect Validator Wallet</h4>
                  <p className="text-slate-300 text-sm">Validator connects wallet and accesses the encrypted messaging interface.</p>
                </div>
              </div>
              <div className="flex items-start space-x-4 p-4 bg-slate-900 rounded-lg">
                <div className="w-8 h-8 bg-purple-600/20 rounded-full flex items-center justify-center text-purple-400 font-bold text-sm">2</div>
                <div>
                  <h4 className="font-semibold text-slate-50">Generate Encryption Keys</h4>
                  <p className="text-slate-300 text-sm">Create or import AES-256 symmetric keys and Ed25519 signing keys for secure communication.</p>
                </div>
              </div>
              <div className="flex items-start space-x-4 p-4 bg-slate-900 rounded-lg">
                <div className="w-8 h-8 bg-purple-600/20 rounded-full flex items-center justify-center text-purple-400 font-bold text-sm">3</div>
                <div>
                  <h4 className="font-semibold text-slate-50">Send Encrypted Messages</h4>
                  <p className="text-slate-300 text-sm">Compose messages about incidents, risk coordination, or network status. Messages are encrypted and digitally signed.</p>
                </div>
              </div>
              <div className="flex items-start space-x-4 p-4 bg-slate-900 rounded-lg">
                <div className="w-8 h-8 bg-purple-600/20 rounded-full flex items-center justify-center text-purple-400 font-bold text-sm">4</div>
                <div>
                  <h4 className="font-semibold text-slate-50">On-Chain Storage</h4>
                  <p className="text-slate-300 text-sm">Messages are stored immutably on Passet chain via EncryptedGroupMessages smart contract.</p>
                </div>
              </div>
              <div className="flex items-start space-x-4 p-4 bg-slate-900 rounded-lg">
                <div className="w-8 h-8 bg-purple-600/20 rounded-full flex items-center justify-center text-purple-400 font-bold text-sm">5</div>
                <div>
                  <h4 className="font-semibold text-slate-50">Governance Unlock</h4>
                  <p className="text-slate-300 text-sm">After governance events, encrypted messages become publicly viewable by users for transparency.</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Color Coding System */}
        <Card className="bg-slate-850 border-slate-800">
          <CardHeader>
            <CardTitle className="text-slate-50">Risk Color Classification System</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <p className="text-slate-300">
              Milkyway2 uses a traffic-light risk classification for validators/events that updates dynamically based on live chain state:
            </p>
            
            {/* RED Critical */}
            <div className="p-4 bg-slate-900 rounded-lg border-l-4 border-danger">
              <div className="flex items-center space-x-2 mb-3">
                <AlertTriangle className="w-5 h-5 text-danger" />
                <h4 className="font-semibold text-danger">RED (Critical)</h4>
              </div>
              <ul className="space-y-1 text-slate-300 text-sm">
                <li>• Validator slashed in last 3 eras (staking.Slashed)</li>
                <li>• Commission &gt; 20%</li>
                <li>• Uptime &lt; 85%</li>
                <li>• Recently "chilled" or disabled</li>
              </ul>
            </div>

            {/* YELLOW Warning */}
            <div className="p-4 bg-slate-900 rounded-lg border-l-4 border-warning">
              <div className="flex items-center space-x-2 mb-3">
                <AlertTriangle className="w-5 h-5 text-warning" />
                <h4 className="font-semibold text-warning">YELLOW (Warning)</h4>
              </div>
              <ul className="space-y-1 text-slate-300 text-sm">
                <li>• Commission 10–20%</li>
                <li>• Uptime 85–95%</li>
                <li>• Rewards expiring soon (&lt;4 days)</li>
                <li>• Validator recently churned (left set)</li>
                <li>• No on-chain identity</li>
              </ul>
            </div>

            {/* GREEN Safe */}
            <div className="p-4 bg-slate-900 rounded-lg border-l-4 border-success">
              <div className="flex items-center space-x-2 mb-3">
                <CheckCircle className="w-5 h-5 text-success" />
                <h4 className="font-semibold text-success">GREEN (Safe)</h4>
              </div>
              <ul className="space-y-1 text-slate-300 text-sm">
                <li>• No slashing recently; commission ≤ 10%; uptime ≥ 95%</li>
                <li>• Active, identity on-chain, not recently churned/disabled</li>
                <li>• Consistent block production and governance participation</li>
              </ul>
            </div>

            <div className="bg-primary/10 p-4 rounded-lg">
              <p className="text-slate-300 text-sm">
                <strong>Note:</strong> Classification is dynamic and updates each session/era based on live chain state and events.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Event Classification */}
        <Card className="bg-slate-850 border-slate-800">
          <CardHeader>
            <CardTitle className="text-slate-50">Event Classification: How Events Feed Into Risk Scoring</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Positive Events */}
            <div className="space-y-3">
              <h4 className="font-semibold text-success">POSITIVE Events (improve score):</h4>
              <div className="bg-slate-900 p-4 rounded-lg">
                <ul className="space-y-2 text-slate-300 text-sm">
                  <li><code className="text-success">staking.Rewarded</code> (pallet-staking): Validator earned rewards</li>
                  <li><code className="text-success">staking.EraRewardPoints</code> (pallet-staking): Block production/authorship</li>
                  <li><code className="text-success">imOnline.SomeoneIsOnline</code> (pallet-im-online): Heartbeat/availability</li>
                  <li><code className="text-success">democracy.Voted / referenda.Voted</code> (pallet-democracy/pallet-referenda): Governance participation</li>
                  <li><code className="text-success">session.NewSession</code> (pallet-session): Validator rejoined</li>
                </ul>
              </div>
            </div>

            {/* Negative Events */}
            <div className="space-y-3">
              <h4 className="font-semibold text-danger">NEGATIVE Events (lower score/critical):</h4>
              <div className="bg-slate-900 p-4 rounded-lg">
                <ul className="space-y-2 text-slate-300 text-sm">
                  <li><code className="text-danger">staking.Slashed</code> (pallet-staking): Penalized for misbehavior</li>
                  <li><code className="text-danger">staking.Chilled</code> (pallet-staking): Removed for poor performance</li>
                  <li><code className="text-danger">offences.OffenceReported</code> (pallet-offences): Major protocol offense</li>
                  <li><code className="text-danger">system.ExtrinsicFailed</code> (pallet-system): Failed transaction (critical if repeated)</li>
                  <li><code className="text-danger">babe.SlotSkipped</code> (pallet-babe): Missed block (if BABE used)</li>
                  <li><code className="text-danger">imOnline missing events</code>: Implies downtime/slashable</li>
                </ul>
              </div>
            </div>

            {/* Neutral Events */}
            <div className="space-y-3">
              <h4 className="font-semibold text-warning">NEUTRAL/CONTEXTUAL Events:</h4>
              <div className="bg-slate-900 p-4 rounded-lg">
                <ul className="space-y-2 text-slate-300 text-sm">
                  <li><code className="text-warning">staking.Bonded/Unbonded/Withdrawn</code>: Lifecycle, not performance</li>
                  <li><code className="text-warning">payout, session info, proposal/seconding</code>: Informational</li>
                </ul>
              </div>
            </div>

            <div className="bg-primary/10 p-4 rounded-lg">
              <p className="text-slate-300 text-sm">
                All event types map to color-coded threshold logic in-app, giving stakers fast actionable insights from a flood of protocol telemetry.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* ZK Attestation & Sybil Resistance */}
        <Card className="bg-slate-850 border-slate-800">
          <CardHeader>
            <CardTitle className="text-slate-50">ZK Attestation & Sybil-Resistant Reputation</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-start space-x-3 mb-4">
              <Shield className="w-6 h-6 text-purple-400 mt-1" />
              <div>
                <h4 className="font-semibold text-slate-50 mb-2">"One-Human-One-Signal" Model</h4>
                <p className="text-slate-300 text-sm">
                  Milkyway2 implements uniqueness-verified reputation for risk voting, feedback, and alerts through 
                  Semaphore zero-knowledge proofs that prevent double-voting and Sybil attacks.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-slate-900 rounded-lg">
                <h4 className="font-semibold text-slate-50 mb-2">Nullifier Hashing</h4>
                <p className="text-slate-300 text-sm">
                  Each user can only submit one report per specific event. The nullifier hash prevents duplicate 
                  submissions while maintaining complete anonymity.
                </p>
              </div>
              <div className="p-4 bg-slate-900 rounded-lg">
                <h4 className="font-semibold text-slate-50 mb-2">Identity Commitment</h4>
                <p className="text-slate-300 text-sm">
                  Users generate a cryptographic identity commitment that proves membership in the reporting group 
                  without revealing their actual identity.
                </p>
              </div>
              <div className="p-4 bg-slate-900 rounded-lg">
                <h4 className="font-semibold text-slate-50 mb-2">Smart Contract Verification</h4>
                <p className="text-slate-300 text-sm">
                  On-chain verification ensures only valid proofs are accepted, blocking attempts to game the system 
                  through multiple accounts or automated submissions.
                </p>
              </div>
              <div className="p-4 bg-slate-900 rounded-lg">
                <h4 className="font-semibold text-slate-50 mb-2">Reputation Aggregation</h4>
                <p className="text-slate-300 text-sm">
                  Anonymous signals are aggregated to create trusted reputation scores for validators without 
                  compromising reporter privacy or enabling collusion.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Validator Events Oracle */}
        <Card className="bg-slate-850 border-slate-800">
          <CardHeader>
            <CardTitle className="text-slate-50">Validator Events Oracle</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-start space-x-3 mb-4">
              <ExternalLink className="w-6 h-6 text-blue-400 mt-1" />
              <div>
                <h4 className="font-semibold text-slate-50 mb-2">Real-Time Event Monitoring</h4>
                <p className="text-slate-300 text-sm">
                  The Validator Events Oracle provides comprehensive real-time monitoring of validator events across 
                  Polkadot, Kusama, and parachain networks. Access detailed event logs, performance metrics, and 
                  incident tracking through our dedicated oracle interface.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-slate-900 rounded-lg">
                <h4 className="font-semibold text-slate-50 mb-2">Event Coverage</h4>
                <p className="text-slate-300 text-sm">
                  Tracks all critical validator events including slashing, rewards, governance participation, 
                  commission changes, and network availability metrics.
                </p>
              </div>
              <div className="p-4 bg-slate-900 rounded-lg">
                <h4 className="font-semibold text-slate-50 mb-2">Multi-Chain Support</h4>
                <p className="text-slate-300 text-sm">
                  Monitors validator activity across the entire Polkadot ecosystem including relay chains 
                  and connected parachains for comprehensive network oversight.
                </p>
              </div>
            </div>

            <div className="flex justify-center pt-4">
              <Button 
                className="bg-blue-600 hover:bg-blue-700 text-white"
                onClick={() => window.open('https://oracle-frontend-milkyway.fly.dev/', '_blank')}
              >
                <ExternalLink className="w-5 h-5 mr-2" />
                Access Validator Events Oracle
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Smart Contract Details */}
        <Card className="bg-slate-850 border-slate-800">
          <CardHeader>
            <CardTitle className="text-slate-50">zkAttestation Smart Contract</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 bg-slate-900 rounded-lg">
              <h4 className="font-semibold text-slate-50 mb-2">Contract Address</h4>
              <div className="flex items-center space-x-3">
                <code className="text-purple-400 text-sm bg-slate-800 px-3 py-1 rounded">
                  0x8EabBe844d33Ac35BBBe340BE5F14001bb17d92D
                </code>
                <Button 
                  variant="outline" 
                  size="sm"
                  className="text-slate-300 border-slate-600 hover:bg-slate-700"
                  onClick={() => window.open('https://blockscout-passet-hub.parity-testnet.parity.io/address/0x8EabBe844d33Ac35BBBe340BE5F14001bb17d92D', '_blank')}
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  View on Passet Blockscout
                </Button>
              </div>
              <p className="text-slate-400 text-sm mt-2">
                Deployed on Passet chain for zero-knowledge proof verification and incident report storage.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-slate-900 rounded-lg">
                <h4 className="font-semibold text-slate-50 mb-2">Functions</h4>
                <ul className="space-y-1 text-slate-300 text-sm">
                  <li>• <code>verifyProof()</code> - Validates ZK proofs</li>
                  <li>• <code>submitReport()</code> - Stores verified reports</li>
                  <li>• <code>checkNullifier()</code> - Prevents double-voting</li>
                  <li>• <code>getReports()</code> - Retrieves report data</li>
                </ul>
              </div>
              <div className="p-4 bg-slate-900 rounded-lg">
                <h4 className="font-semibold text-slate-50 mb-2">Security Features</h4>
                <ul className="space-y-1 text-slate-300 text-sm">
                  <li>• Semaphore circuit integration</li>
                  <li>• Nullifier hash validation</li>
                  <li>• Merkle tree membership proofs</li>
                  <li>• Gas-optimized verification</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Troubleshooting */}
        <Card className="bg-slate-850 border-slate-800">
          <CardHeader>
            <CardTitle className="text-slate-50">Troubleshooting</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-4">
              <div className="p-4 bg-slate-900 rounded-lg">
                <h4 className="font-semibold text-slate-50 mb-2">Wallet Connection Issues</h4>
                <ul className="space-y-1 text-slate-300 text-sm">
                  <li>• Ensure SubWallet or Polkadot.js extension is installed and enabled</li>
                  <li>• Check that you have at least one account created in your wallet</li>
                  <li>• Refresh the page and try connecting again</li>
                  <li>• Clear browser cache and cookies if connection persists failing</li>
                </ul>
              </div>
              
              <div className="p-4 bg-slate-900 rounded-lg">
                <h4 className="font-semibold text-slate-50 mb-2">ZK Proof Generation Failing</h4>
                <ul className="space-y-1 text-slate-300 text-sm">
                  <li>• Ensure you have a stable internet connection</li>
                  <li>• Check that your browser supports WebAssembly</li>
                  <li>• Try disabling browser extensions that might interfere with crypto operations</li>
                  <li>• Increase browser memory limits for large proof calculations</li>
                </ul>
              </div>
              
              <div className="p-4 bg-slate-900 rounded-lg">
                <h4 className="font-semibold text-slate-50 mb-2">Data Not Loading</h4>
                <ul className="space-y-1 text-slate-300 text-sm">
                  <li>• Check your internet connection and try refreshing</li>
                  <li>• Verify that Polkadot RPC endpoints are accessible</li>
                  <li>• Clear application data and restart the browser</li>
                  <li>• Check if network maintenance is affecting data sources</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Roadmap Section */}
        <Card className="bg-slate-850 border-slate-800">
          <CardHeader>
            <CardTitle className="text-slate-50">Development Roadmap</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {/* Phase 1 */}
              <div className="border-l-4 border-primary pl-4">
                <div className="flex items-center space-x-2 mb-2">
                  <h4 className="font-semibold text-slate-50">Phase 1: Hackathon MVP</h4>
                  <Badge className="bg-primary/20 text-primary">Current</Badge>
                </div>
                <p className="text-slate-400 text-sm mb-3">Timeline: Immediate</p>
                <ul className="space-y-1 text-slate-300 text-sm">
                  <li>• SubWallet and Polkadot.js wallet integration</li>
                  <li>• Color-coded risk evaluation system</li>
                  <li>• Zero-knowledge anonymous incident reporting</li>
                  <li>• OpenGov referenda feed integration</li>
                </ul>
              </div>

              {/* Phase 2 */}
              <div className="border-l-4 border-warning pl-4">
                <div className="flex items-center space-x-2 mb-2">
                  <h4 className="font-semibold text-slate-50">Phase 2: Enhanced Features</h4>
                  <Badge className="bg-warning/20 text-warning">Planned</Badge>
                </div>
                <p className="text-slate-400 text-sm mb-3">Timeline: Q4 2025</p>
                <ul className="space-y-1 text-slate-300 text-sm">
                  <li>• Premium notification system (email, SMS)</li>
                  <li>• Multi-wallet support and data export features</li>
                  <li>• Risk log integration for DeFi applications</li>
                  <li>• Advanced analytics and reporting tools</li>
                </ul>
              </div>

              {/* Phase 3 */}
              <div className="border-l-4 border-success pl-4">
                <div className="flex items-center space-x-2 mb-2">
                  <h4 className="font-semibold text-slate-50">Phase 3: DAO Integration</h4>
                  <Badge className="bg-success/20 text-success">Future</Badge>
                </div>
                <p className="text-slate-400 text-sm mb-3">Timeline: 2026</p>
                <ul className="space-y-1 text-slate-300 text-sm">
                  <li>• ZK-powered governance voting system</li>
                  <li>• Full DAO risk aggregation platform</li>
                  <li>• Strategic partnerships with validators</li>
                  <li>• OpenGov grant proposals and funding</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Technical Implementation */}
        <Card className="bg-slate-850 border-slate-800">
          <CardHeader>
            <CardTitle className="text-slate-50">Technical Implementation</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-slate-900 rounded-lg">
                <h4 className="font-semibold text-slate-50 mb-2">Frontend Stack</h4>
                <ul className="space-y-1 text-slate-300 text-sm">
                  <li>• React with TypeScript</li>
                  <li>• TailwindCSS for styling</li>
                  <li>• Polkadot.js Extension API</li>
                  <li>• Tanstack Query for state management</li>
                </ul>
              </div>
              <div className="p-4 bg-slate-900 rounded-lg">
                <h4 className="font-semibold text-slate-50 mb-2">Blockchain Integration</h4>
                <ul className="space-y-1 text-slate-300 text-sm">
                  <li>• Polkadot API for validator data</li>
                  <li>• Semaphore Protocol for ZK proofs</li>
                  <li>• Passet chain smart contracts</li>
                  <li>• Real-time WebSocket connections</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Features Overview */}
        <Card className="bg-slate-850 border-slate-800">
          <CardHeader>
            <CardTitle className="text-slate-50">Key Features</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4">
                <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <CheckCircle className="w-6 h-6 text-primary" />
                </div>
                <h4 className="font-semibold text-slate-50 mb-2">Risk Assessment</h4>
                <p className="text-slate-400 text-sm">
                  Real-time validator risk evaluation with color-coded alerts
                </p>
              </div>
              
              <div className="text-center p-4">
                <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <Shield className="w-6 h-6 text-purple-400" />
                </div>
                <h4 className="font-semibold text-slate-50 mb-2">Anonymous Reporting</h4>
                <p className="text-slate-400 text-sm">
                  ZK-proof powered incident reporting with complete privacy
                </p>
              </div>
              
              <div className="text-center p-4">
                <div className="w-12 h-12 bg-success/20 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <Users className="w-6 h-6 text-success" />
                </div>
                <h4 className="font-semibold text-slate-50 mb-2">Governance Integration</h4>
                <p className="text-slate-400 text-sm">
                  Real-time OpenGov referenda tracking and analysis
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
