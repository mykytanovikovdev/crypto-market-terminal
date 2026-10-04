# Market Terminal

A live crypto market dashboard built with Vue 3 + TypeScript: REST API
integration, real-time data over WebSocket, and a deliberately non-generic UI.

## Stack
Vue 3 · TypeScript · Pinia · Vite · CoinGecko API · Binance public WebSocket
· TradingView Lightweight Charts (planned)

## Getting started
```bash
npm install
npm run dev
```

## Data sources
- [CoinGecko API](https://docs.coingecko.com/reference/introduction) — market
  data, no key required for the free tier
- [Binance WebSocket streams](https://developers.binance.com/docs/binance-spot-api-docs/web-socket-streams) — live trade ticks, no auth required
