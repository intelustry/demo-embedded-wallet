# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

- `pnpm dev` - Start development server
- `pnpm build` - Build production bundle 
- `pnpm start` - Start production server
- `pnpm lint` - Run ESLint
- `pnpm format` - Format code with Prettier
- `pnpm format:check` - Check code formatting
- `pnpm test` - Run test suite (Vitest)
- `pnpm test:watch` - Run tests in watch mode
- `pnpm test:coverage` - Run tests with coverage report
- `pnpm agent:orchestrate` - Run orchestrator agent via Cursor SDK
- `pnpm agent:run` - Run a single agent skill via Cursor SDK

## Architecture Overview

NGP Wallet Integration (ngp-wallet-int) is a Next.js 14+ application providing enterprise embedded wallet functionality with multiple authentication methods, powered by Turnkey infrastructure.

### Core Technologies
- **Framework**: Next.js 14 with App Router
- **Authentication**: Turnkey SDK for wallet-based auth, OAuth (Google, Apple, Facebook), email auth, passkeys
- **Blockchain**: Ethereum (Sepolia testnet) via Viem and Alchemy
- **UI**: shadcn/ui components with Radix UI primitives and Tailwind CSS
- **Type Safety**: TypeScript with Zod schema validation
- **Testing**: Vitest with React Testing Library
- **Deployment**: Docker (multi-stage build with standalone output)
- **CI/CD**: GitHub Actions
- **Agent System**: Cursor SDK with 4 specialized agent skills

### Key Architecture Patterns

**Provider Hierarchy** (`src/providers/index.tsx`):
```
ThemeProvider > TurnkeyProvider > AuthProvider
```

**Authentication Flow**:
1. Multiple auth methods funnel through `AuthProvider` context
2. Creates Turnkey sub-organizations for users via server actions
3. Manages sessions and wallet state globally
4. Supports passkeys, OAuth providers, email magic links, and wallet imports

**Server Actions Pattern** (`src/actions/`):
- `turnkey.ts` - Core Turnkey operations (user creation, auth, wallet management)
- `web3.ts` - Blockchain interactions (transactions, balance queries)
- All use "use server" directive for secure server-side operations

**Environment Configuration** (`src/env.mjs`):
- Uses `@t3-oss/env-nextjs` for type-safe environment variables
- Separates client/server environment variables
- Validates all required Turnkey, OAuth, and blockchain API keys

### Turnkey Integration Details

**Configuration** (`src/config/turnkey.ts`):
- Manages iframe URLs for auth, export, and import flows
- Configures passkey settings with RP ID
- Sets up Ethereum RPC via Alchemy

**Key Components**:
- Sub-organization creation per user with embedded wallets
- Warchest system for funding new wallets (0.001 ETH via `fundWallet`)
- Support for multiple authenticator types (passkeys, OAuth, API keys)
- Session management with expiry warnings

**Wallet Operations**:
- Default Ethereum accounts created automatically
- Transaction history via Alchemy SDK
- Support for wallet export/import flows
- Address validation and balance checking

### App Router Structure

**Route Groups**:
- `(landing)` - Unauthenticated pages (login, OAuth callbacks)
- `(dashboard)` - Authenticated pages (wallet dashboard, settings)

**Key Pages**:
- `/` - Landing page with authentication options
- `/dashboard` - Main wallet interface
- `/settings` - User settings and account management
- `/api/health` - Health check endpoint for Docker/load balancer probes

### Multi-Agent System

See `AGENTS.md` for full documentation. Four specialized agents:
- **Orchestrator**: Coordinates specialist agents, decomposes tasks
- **Enterprise Solutions Architect**: Architecture, scalability, security
- **Monetization Strategist**: Revenue models, pricing, go-to-market
- **Business Intelligence**: OSINT, competitive analysis, tech radar

Agent skills live in `.cursor/skills/ngp-*/SKILL.md`. Programmatic invocation via `scripts/agents/` using `@cursor/sdk`.
