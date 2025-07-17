# Milkyway2 🌌

> Decentralized Blockchain Validator Risk & Incident Reporting Application

Milkyway2 is a cutting-edge Web3 application designed for transparent, privacy-preserving validator incident and risk reporting on Polkadot and Passet chains. The platform combines real-time validator monitoring with zero-knowledge anonymous reporting using the Semaphore protocol to ensure network security and transparency.

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
- **Governance Unlock Events**: Messages become publicly decryptable after designated on-chain events
- **Immutable Storage**: Messages stored permanently on Passet chain with full transparency post-unlock
- **Smart Contract Integration**: EncryptedGroupMessages contract deployed on Passet chain for decentralized storage

### 🏛️ Governance Integration
- **OpenGov Referenda Tracking**: Real-time monitoring of Polkadot governance proposals
- **Voting Analytics**: Support percentage and participation metrics
- **Active Status Monitoring**: Time-based updates for referendum progress

### 💳 Multi-Wallet Support
- **SubWallet Integration**: Seamless connection with SubWallet browser extension
- **Polkadot.js Compatibility**: Full support for Polkadot.js extension
- **Persistent Sessions**: Secure wallet connections with localStorage management

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm
- PostgreSQL database (or Neon serverless)
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

3. **Configure environment**
   ```bash
   # Create .env file with your database URL
   echo "DATABASE_URL=your_postgresql_connection_string" > .env
   ```

4. **Run database migrations**
   ```bash
   npm run db:push
   ```

5. **Start development server**
   ```bash
   npm run dev
   ```

The application will be available at `http://localhost:5001`

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

### 1. Connect Your Wallet
Click "Connect Wallet" in the header and approve the connection with your SubWallet or Polkadot.js extension.

### 2. Monitor Validators
- Navigate to the **Validators** page to view real-time validator performance
- Use filters to find validators by risk level (Good/Neutral/Bad)
- Click "View suggested action" for personalized recommendations

### 3. Submit Anonymous Reports
- Click "Report Incident" on any problematic validator
- Generate a zero-knowledge proof to maintain anonymity
- Submit verified reports to help protect the network

### 4. Track Governance
- Visit the **Governance** page for active referendum monitoring
- View voting progress and community participation metrics
- Stay informed about important network decisions

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
- `npm run db:push` - Push database schema changes
- `npm run db:studio` - Open Drizzle Studio for database management

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

Built with ❤️ for the Polkadot ecosystem. Empowering transparent, decentralized validator monitoring.
