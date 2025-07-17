import Header from "@/components/layout/header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function Documentation() {
  return (
    <div className="min-h-screen bg-slate-950">
      <Header 
        title="Documentation"
        subtitle="Learn about Milkyway2's mission, roadmap, and technical implementation"
      />

      <main className="p-6 space-y-6">
        {/* Mission Section */}
        <Card className="bg-slate-850 border-slate-800">
          <CardHeader>
            <CardTitle className="text-slate-50">Mission</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-slate-300">
              Milkyway2 is a decentralized Web3 application aimed at transparent, privacy-preserving validator 
              incident and risk reporting on Polkadot and Passet chains. Our platform combines real-time 
              validator monitoring with zero-knowledge anonymous reporting to ensure network security and transparency.
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
            
            <div className="p-4 bg-slate-900 rounded-lg">
              <h4 className="font-semibold text-slate-50 mb-2">Smart Contract Details</h4>
              <p className="text-slate-300 text-sm mb-2">
                zkAttestation Contract deployed on Passet chain:
              </p>
              <code className="text-purple-400 text-sm bg-slate-800 px-2 py-1 rounded">
                0x8EabBe844d33Ac35BBBe340BE5F14001bb17d92D
              </code>
              <p className="text-slate-400 text-sm mt-2">
                View on Passet Blockscout Explorer for transaction history and verification.
              </p>
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
                  <svg className="w-6 h-6 text-primary" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                  </svg>
                </div>
                <h4 className="font-semibold text-slate-50 mb-2">Risk Assessment</h4>
                <p className="text-slate-400 text-sm">
                  Real-time validator risk evaluation with color-coded alerts
                </p>
              </div>
              
              <div className="text-center p-4">
                <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <svg className="w-6 h-6 text-purple-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"/>
                  </svg>
                </div>
                <h4 className="font-semibold text-slate-50 mb-2">Anonymous Reporting</h4>
                <p className="text-slate-400 text-sm">
                  ZK-proof powered incident reporting with complete privacy
                </p>
              </div>
              
              <div className="text-center p-4">
                <div className="w-12 h-12 bg-success/20 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <svg className="w-6 h-6 text-success" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"/>
                  </svg>
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
