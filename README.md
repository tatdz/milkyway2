# Milkyway2 🌌

> Decentralized Blockchain Validator Risk & Incident Reporting Application

Milkyway2 is a cutting-edge Web3 application designed for transparent, privacy-preserving validator incident and risk reporting on Polkadot, Kusama, and parachains. The platform combines real-time validator monitoring with zero-knowledge anonymous reporting using the Semaphore protocol to ensure network security and transparency for both users and validators.

## ✨ Features

### 🔍 Real-Time Validator Monitoring
- **Traffic-Light Risk Classification**: RED (slashed/high commission/low uptime), YELLOW (medium risk), GREEN (safe validators)
- **Comprehensive Risk Assessment**: Commission rates, uptime tracking, slash event monitoring
- **Performance Analytics**: Historical event logging and trend analysis
- **Smart Suggestions**: Risk-specific actionable recommendations for validator management

### 🛡️ Zero-Knowledge Anonymous Reporting
- **Semaphore Protocol Integration**: Privacy-preserving incident reporting without revealing reporter identity
- **Sybil Resistance**: zkAttestation smart contract on Passet chain prevents duplicate reports
- **One-Human-One-Signal**: Ensures authentic reporting through proof verification
- **Nullifier Protection**: Prevents double-spending while maintaining complete anonymity

### 🔐 Validator Encrypted Messaging
- **Group Symmetric Encryption**: Validators securely post encrypted messages using AES-256
- **Ed25519 Digital Signatures**: All messages signed and verified on-chain for authenticity  
- **Governance Unlock Events**: Encrypted messages become publicly viewable by users after governance unlock events
- **Immutable Storage**: Messages stored permanently on Passet chain with full transparency post-unlock
- **Smart Contract Integration**: EncryptedGroupMessages contract deployed on Passet chain for decentralized storage
- **Validator Collaboration**: Secure communication channel for risk coordination and incident response

### 🏛️ Governance Integration
- **OpenGov Referenda Tracking**: Real-time monitoring of Polkadot governance proposals
- **Voting Analytics**: Support percentage and participation metrics
- **Active Status Monitoring**: Time-based updates for referendum progress

### 💳 Multi-Wallet Support
- **SubWallet Integration**: Seamless connection with SubWallet browser extension
- **Polkadot.js Compatibility**: Full support for Polkadot.js extension
- **Persistent Sessions**: Secure wallet connections with localStorage management

### 🔍 Validator Events Oracle
- **Real-Time Event Monitoring**: Comprehensive tracking of validator events across Polkadot, Kusama, and parachains
- **Multi-Chain Coverage**: Monitor validator activity across the entire Polkadot ecosystem
- **Performance Analytics**: Detailed event logs, metrics, and incident tracking
- **Oracle Interface**: [Access the Validator Events Oracle →](https://oracle-frontend-milkyway.fly.dev/)

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm
- SubWallet or Polkadot.js browser extension

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/tatdz/milkyway2.git
   cd milkyway2
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the application**
   ```bash
   npm run dev
   ```

The application will be available at `http://localhost:5001`

The app uses in-memory storage for development - no database setup required! Data persists during your session and resets when you restart the server.

## 🏗️ Architecture

### Frontend Stack
- **React 18** with TypeScript for type-safe component development
- **TailwindCSS** with shadcn/ui components for modern, accessible design
- **TanStack React Query** for efficient server state management
- **Wouter** for lightweight client-side routing
- **Vite** for fast development and optimized production builds

### Backend Stack
- **Node.js + Express** for RESTful API development
- **Drizzle ORM** for type-safe database operations
- **PostgreSQL** for reliable data persistence
- **TypeScript** throughout for enhanced developer experience

### Blockchain Integration
- **@polkadot/api** for core Polkadot blockchain interaction
- **@polkadot/extension-dapp** for wallet extension integration
- **@semaphore-protocol** for zero-knowledge proof generation and verification

## 🎯 Usage Guide

### For Users: Network Monitoring & Risk Assessment

1. **Connect Your Wallet**
   - Click "Connect Wallet" in the header and approve the connection with your SubWallet or Polkadot.js extension
   - Access all features across Polkadot, Kusama, and parachains

2. **Monitor Validators**
   - Navigate to the **Validators** page to view real-time validator performance
   - Use filters to find validators by risk level (Good/Neutral/Bad)
   - Click "View suggested action" for personalized recommendations

3. **Submit Anonymous Reports**
   - Click "Report Incident" on any problematic validator
   - Generate a zero-knowledge proof to maintain anonymity
   - Submit verified reports to help protect the network

4. **Track Governance**
   - Visit the **Governance** page for active referendum monitoring
   - View voting progress and community participation metrics
   - Stay informed about important network decisions

5. **View Validator Communications**
   - Access the **Message Feed** to see unlocked validator communications
   - Review transparent post-unlock messages about network incidents and coordination

### For Validators: Secure Communication & Risk Management

1. **Access Validator Messaging**
   - Navigate to **Validator Messaging** in the sidebar
   - Connect your validator wallet for identity verification

2. **Generate Encryption Keys**
   - Use the **Key Management** tab to generate secure AES-256 and Ed25519 keys
   - Export keys for backup or import existing validator group keys

3. **Send Encrypted Messages**
   - Use the **Send Messages** tab to compose encrypted communications
   - Messages are cryptographically signed and stored on Passet chain
   - Choose between blockchain or database storage options

4. **Coordinate Risk Response**
   - Securely communicate about network incidents, slash events, or governance issues
   - Messages remain encrypted until governance unlock events make them publicly viewable
   - Enable transparent post-incident analysis while maintaining operational privacy

## 🛠️ Development

### Project Structure
```
milkyway2/
├── client/              # React frontend application
│   ├── src/
│   │   ├── components/  # Reusable UI components
│   │   ├── pages/       # Application pages
│   │   ├── hooks/       # Custom React hooks
│   │   └── lib/         # Utility functions and API clients
├── server/              # Express backend API
│   ├── routes.ts        # API route definitions
│   └── storage.ts       # Data persistence layer
├── shared/              # Shared types and schemas
│   └── schema.ts        # Database schema and types
└── README.md
```

### Available Scripts

- `npm run dev` - Start development server with hot reloading
- `npm run build` - Build production application

For production deployment, you can optionally configure a PostgreSQL database via the `DATABASE_URL` environment variable. The app will automatically use database storage if available, otherwise it falls back to in-memory storage.

### Risk Classification System

**🔴 RED (High Risk)**
- Validators that have been slashed
- Commission rates >20%
- Uptime <85%
- Multiple recent incidents

**🟡 YELLOW (Medium Risk)**
- Commission rates 10-20%
- Uptime 85-95%
- Some performance concerns
- Mixed performance signals

**🟢 GREEN (Low Risk)**
- Commission rates <10%
- Uptime >95%
- No recent incidents
- Consistent performance

## 🔐 Security & Privacy

### Zero-Knowledge Proofs
Milkyway2 uses the Semaphore protocol to enable completely anonymous incident reporting. When you submit a report:

1. **Identity Generation**: Create a Semaphore identity without revealing personal information
2. **Proof Creation**: Generate a zero-knowledge proof of your right to report
3. **Nullifier Protection**: Prevent duplicate reports while maintaining anonymity
4. **Smart Contract Verification**: zkAttestation contract on Passet chain validates all proofs

### Smart Contract Integration
- **Smart Contracts**: EncryptedGroupMessages and zkAttestation deployed on Passet Chain
- **Verification Links**: Integrated block explorer links for transparency
- **Sybil Resistance**: One human, one signal enforcement through on-chain verification
- **Cross-Chain Compatibility**: Full support for Polkadot, Kusama, and parachain ecosystems

## 🤝 Contributing

We welcome contributions! Here's how to get started:

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines
- Follow TypeScript best practices
- Use the existing component structure and styling patterns
- Add tests for new functionality
- Update documentation for significant changes

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.


---

Built with ❤️ for the Polkadot ecosystem. Empowering transparent, decentralized validator monitoring and secure collaboration across Polkadot, Kusama, and parachains.
