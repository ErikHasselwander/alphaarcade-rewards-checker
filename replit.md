# ALPHA Rewards Checker

## Overview

This is a React-based web application that checks USDC rewards received from the ALPHA rewards program on the Algorand blockchain. Users can input an Algorand wallet address to view their total rewards and transaction history. The application queries the Algorand Indexer API to fetch transaction data and displays it in a clean, user-friendly interface.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **React 18** with TypeScript for the user interface
- **Vite** as the build tool and development server for fast hot module replacement
- **Wouter** for client-side routing (lightweight React router alternative)
- **TanStack Query** for API state management and caching
- **Tailwind CSS** with **shadcn/ui** component library for styling and UI components
- **Radix UI** primitives for accessible, unstyled components

### Backend Architecture
- **Express.js** server with TypeScript for API handling
- **Monorepo structure** with shared types between client and server
- **In-memory storage** implementation with interface for future database integration
- **RESTful API** design with `/api` prefix for all backend routes

### Data Storage Solutions
- **Drizzle ORM** configured for PostgreSQL with schema definition
- **Neon Database** serverless PostgreSQL for production
- **Session management** with `connect-pg-simple` for PostgreSQL session storage
- **Memory storage** fallback for development/testing

### Authentication and Authorization
- Basic user schema with username/password fields
- Session-based authentication infrastructure ready for implementation
- Zod validation schemas for type-safe data validation

### External Service Integrations
- **Algorand Indexer API** (nodely.io) for blockchain transaction queries
- **Algorand mainnet/testnet/betanet** support for different network environments
- Real-time transaction fetching with pagination support for large datasets

### Key Design Decisions

**Monorepo Structure**: Shared TypeScript schemas between client and server ensure type safety across the full stack and reduce code duplication.

**Component-Based UI**: shadcn/ui provides a consistent design system with customizable components, while Radix UI ensures accessibility compliance.

**API-First Design**: Direct integration with Algorand Indexer API eliminates the need for a custom blockchain data layer, reducing complexity and improving performance.

**Responsive Design**: Mobile-first approach with Tailwind CSS ensures optimal user experience across all device sizes.

**State Management**: TanStack Query handles API caching and loading states, providing a smooth user experience with automatic background refetching.