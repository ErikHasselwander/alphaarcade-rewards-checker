# ALPHA Rewards Checker

A React-based web application for checking USDC rewards received from the ALPHA rewards program on the Algorand blockchain.

## Features

- Input Algorand wallet address to view USDC rewards
- Interactive cumulative rewards chart with date filtering
- Direct URL access (e.g., `/YOUR_ADDRESS_HERE`)
- Real-time data from Algorand Indexer API
- Responsive design with clean UI

## Deployment

### Vercel Deployment

1. Connect your repository to Vercel
2. Configure build settings:
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist/public`
   - **Install Command**: `npm install`
3. Deploy

The app is configured as a Single Page Application (SPA) with client-side routing. The `vercel.json` configuration handles routing for direct URL access to specific addresses.

### Environment Variables

No environment variables required - the app uses the public Algorand Indexer API.

## Development

```bash
npm install
npm run dev
```

## Tech Stack

- React 18 + TypeScript
- Vite for build tooling
- TailwindCSS + shadcn/ui components
- TanStack Query for API state management
- Recharts for data visualization
- Wouter for routing