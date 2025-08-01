# Cryptocurrency Dashboard (MacV AI Frontend Engineer Intern Assignment)

A full-featured cryptocurrency dashboard built with Next.js 14+ (App Router), TypeScript, Tailwind CSS, shadcn/ui, and react-chartjs-2. Deployed on Vercel.

## Features
- **Home page**: Paginated table (50 per page) of cryptocurrencies from CoinGecko, with search, filters, loading skeletons, and error/empty states.
- **Coin Detail page**: Price, market cap, volume, rank, supply, and interactive chart (24h, 7d, 30d, 90d).
- **Watchlist**: ⭐ Favorite coins, persisted in localStorage, with live price updates.
- **API Proxy**: Next.js API routes proxy CoinGecko endpoints, with error handling and optional in-memory caching.
- **Responsive UI**: Built with Tailwind CSS and shadcn/ui.
- **Reusable Components**: Modular, maintainable codebase.

## Tech Stack
- Next.js 14+ (App Router)
- TypeScript
- Tailwind CSS + shadcn/ui
- react-chartjs-2
- State: useState, useEffect, localStorage

## Getting Started
1. Install dependencies:
   ```bash
   npm install
   ```
2. Create `.env.local` and add your CoinGecko API key if needed.
3. Run the development server:
   ```bash
   npm run dev
   ```
4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Deployment
- Ready for Vercel deployment. See `vercel.json` for config.

## Assignment Notes
- See assignment prompt for detailed requirements and features.
