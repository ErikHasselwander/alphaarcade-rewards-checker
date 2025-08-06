# ALPHA Rewards Checker

## Overview

This is a React-based web application that checks USDC rewards received from the ALPHA rewards program on the Algorand blockchain. Users can input an Algorand wallet address to view their total rewards and transaction history. The application queries the Algorand Indexer API to fetch transaction data and displays it in a clean, user-friendly interface.

**Deployment Status**: Restructured for Vercel deployment as a static SPA with client-side routing support.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **React 18** with TypeScript for the user interface
- **Vite** as the build tool and development server for fast hot module replacement
- **Wouter** for client-side routing with URL parameter support for direct address checking
- **TanStack Query** for API state management and caching
- **Tailwind CSS** with **shadcn/ui** component library for styling and UI components
- **Radix UI** primitives for accessible, unstyled components
- **Recharts** for interactive cumulative rewards visualization

### Backend Architecture
- **Express.js** server with TypeScript for API handling
- **Monorepo structure** with shared types between client and server
- **In-memory storage** implementation with interface for future database integration
- **RESTful API** design with `/api` prefix for all backend routes

### Deployment Configuration
- **Vercel-ready**: Configured for static deployment with SPA routing
- **Client-side only**: No backend required - direct API integration
- **Build output**: `dist/public` directory for Vercel deployment
- **Routing support**: `vercel.json` handles client-side routing for direct address URLs

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

**URL Routing**: Direct address checking via URL parameters (e.g., `/CHMP44CAUGU7DUKKTWA65MTR6CJDHQRWDYODHA2CJ4XMOWEBFGXKPJXH7Q`) for easy sharing and bookmarking of specific wallet results.

**Interactive Visualization**: Date-filterable cumulative rewards chart with clean line visualization, hover tooltips, and responsive design for tracking reward accumulation over time.

**Static Deployment**: Restructured as a client-side-only application for easy deployment on Vercel, Netlify, or similar static hosting platforms.