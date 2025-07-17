# Milkyway2 - Decentralized Blockchain Validator Risk & Incident Reporting App

## Overview

Milkyway2 is a decentralized Web3 application designed for transparent, privacy-preserving validator incident and risk reporting on Polkadot and Passet chains. The application combines real-time validator monitoring with zero-knowledge anonymous reporting using Semaphore protocol to ensure network security and transparency.

## User Preferences

Preferred communication style: Simple, everyday language.

## Recent Changes

**January 17, 2025**
- ✓ Fixed "View suggested action" buttons with comprehensive suggestion modal system
- ✓ Created new Milkyway2 logo with Silkscreen font (normal weight) and animated galaxy icon
- ✓ Added detailed risk-specific recommendations for validator management
- ✓ Implemented severity-coded action items (critical/warning/info) with external resource links
- ✓ Added comprehensive README.md for GitHub repository with full project documentation
- ✓ Implemented validator encrypted messaging system with AES-256 encryption and Ed25519 signatures
- ✓ Created validator onboarding page with key management and secure message submission
- ✓ Added governance unlock functionality for public message decryption

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Styling**: TailwindCSS with custom design system using shadcn/ui components
- **State Management**: TanStack React Query for server state management
- **Routing**: Wouter for lightweight client-side routing
- **Build Tool**: Vite with custom configuration for development and production

### Backend Architecture
- **Runtime**: Node.js with Express.js server
- **Language**: TypeScript with ES modules
- **API Design**: RESTful API with JSON responses
- **Development**: Hot reloading with Vite middleware integration

### Database Architecture
- **ORM**: Drizzle ORM with TypeScript-first approach
- **Database**: PostgreSQL (configured for Neon serverless)
- **Migration System**: Drizzle Kit for schema migrations
- **Schema Location**: Shared between client and server (`/shared/schema.ts`)

## Key Components

### 1. Validator Monitoring System
- **Risk Evaluation Engine**: Color-coded alert system (good/neutral/bad) based on commission rates, uptime, and slash events
- **Real-time Data**: Integration with Polkadot API for live validator metrics
- **Performance Tracking**: Historical event logging and analysis

### 2. Zero-Knowledge Reporting System
- **Anonymous Reports**: Semaphore protocol implementation for privacy-preserving incident reporting
- **Proof Generation**: Client-side ZK proof creation for report submissions
- **Nullifier Hashing**: Prevents double-spending while maintaining anonymity

### 3. Governance Integration
- **OpenGov Referenda**: Real-time tracking of Polkadot governance proposals
- **Voting Analytics**: Support percentage and participation metrics
- **Status Monitoring**: Active referendum tracking with time-based updates

### 4. Wallet Integration
- **Multi-Wallet Support**: SubWallet and Polkadot.js extension compatibility
- **Account Management**: Persistent wallet connections with localStorage
- **Transaction Signing**: Secure interaction with blockchain networks

### 5. Validator Encrypted Messaging System
- **AES-256 Encryption**: Validators encrypt messages with group symmetric keys before on-chain submission
- **Ed25519 Digital Signatures**: All messages cryptographically signed for authenticity verification
- **Key Management Interface**: Secure key generation, export/import, and storage functionality
- **Governance-Controlled Decryption**: Messages unlock publicly after designated on-chain events
- **Immutable Storage**: Encrypted messages stored permanently on Passet chain for transparency

## Data Flow

### 1. Validator Data Pipeline
```
Polkadot API → Risk Evaluator → Database → Frontend Dashboard
```
- Validator data fetched from multiple RPC endpoints
- Risk assessment applied using predefined thresholds
- Results cached in PostgreSQL for performance
- Real-time updates pushed to dashboard components

### 2. Incident Reporting Flow
```
User Input → ZK Proof Generation → API Submission → Database Storage → Verification
```
- Anonymous report creation with Semaphore identity
- Client-side proof generation for privacy
- Server-side verification and storage
- Nullifier hash prevents duplicate reports

### 3. Governance Data Flow
```
Polkadot API → Referendum Parser → Database → Governance Dashboard
```
- Active referenda fetched from governance modules
- Status and voting data processed and stored
- Real-time updates for proposal changes

## External Dependencies

### Blockchain Integration
- **@polkadot/api**: Core Polkadot blockchain interaction
- **@polkadot/extension-dapp**: Wallet extension integration
- **@neondatabase/serverless**: PostgreSQL database connection

### Privacy & Cryptography
- **@semaphore-protocol/identity**: ZK identity management
- **@semaphore-protocol/proof**: Zero-knowledge proof generation

### UI & Styling
- **@radix-ui/***: Accessible component primitives
- **tailwindcss**: Utility-first CSS framework
- **class-variance-authority**: Component variant management

### Development Tools
- **vite**: Build tool and development server
- **drizzle-orm**: Type-safe database queries
- **@tanstack/react-query**: Server state management

## Deployment Strategy

### Development Environment
- **Local Development**: Vite dev server with Express backend
- **Hot Reloading**: Full-stack development with automatic updates
- **Database**: Local PostgreSQL or Neon development instance

### Production Deployment
- **Build Process**: 
  - Frontend: Vite build to `/dist/public`
  - Backend: esbuild compilation to `/dist/index.js`
- **Static Assets**: Served through Express static middleware
- **Database**: Neon PostgreSQL serverless instance
- **Environment Variables**: DATABASE_URL for production database connection

### Configuration Management
- **Environment-based**: Different configurations for development/production
- **Database Migrations**: Automated schema deployment with Drizzle
- **Asset Optimization**: Vite handles bundling, minification, and tree-shaking

The application follows a modular architecture with clear separation between frontend components, backend API routes, and shared data models, enabling scalable development and deployment across different environments.