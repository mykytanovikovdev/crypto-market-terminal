# Market Terminal

[![CI](https://github.com/mykytanovikovdev/crypto-market-terminal/actions/workflows/ci.yml/badge.svg)](https://github.com/mykytanovikovdev/crypto-market-terminal/actions/workflows/ci.yml)

A live crypto market dashboard built with Vue 3 + TypeScript: REST API
integration, real-time data over WebSocket, and a deliberately non-generic UI.

## Features

- Top 50 coins by market cap: price, 1h / 24h / 7d change, market cap, 24h volume,
  circulating supply and a 7-day sparkline
- Live prices and 24h change from Binance for coins listed there, with a connection indicator
  that pauses in background tabs and reconnects automatically
- Coin pages with a candlestick or line chart (TradingView Lightweight Charts), volume,
  SMA 20/50 and RSI 14, an OHLCV legend that follows the cursor, market stats, a converter
  and the coin's description and links
- Sorting, search and gainers/losers filters, all kept in the URL
- Watchlist saved in the browser
- Price alerts with browser notifications and in-app toasts; coins with alerts stay tracked on
  every page and in background tabs (coins without a Binance pair are checked once a minute)
- English and Persian (right-to-left) interface
- Light and dark themes that follow the system setting by default
- Responsive layout with a sticky coin column on small screens

## Stack

- Vue 3 (Composition API, `<script setup>`), TypeScript, Vite
- TradingView Lightweight Charts
- Pinia, Vue Router, Vue I18n
- Axios for REST, native WebSocket for live ticks
- Sass with BEM naming
- Vitest + Vue Test Utils
- ESLint, Stylelint, Prettier

## Getting started

Requires Node.js 24 (see `.nvmrc`).

```bash
nvm use
npm install
npm run dev
```

## Scripts

| Command              | What it does                                                 |
| -------------------- | ------------------------------------------------------------ |
| `npm run dev`        | Start the dev server                                         |
| `npm run build`      | Type-check and build for production                          |
| `npm run test`       | Run unit and component tests (see [`tests/`](./tests))       |
| `npm run lint`       | Lint TypeScript and Vue files                                |
| `npm run lint:style` | Lint styles (SCSS, BEM naming, logical properties)           |
| `npm run format`     | Format the codebase with Prettier                            |
| `npm run check`      | Type-check, lint, format check and tests — run before a push |

The same checks and a production build run on every pull request and on pushes to `main`
via [GitHub Actions](.github/workflows/ci.yml).

## Data sources

- [CoinGecko API](https://docs.coingecko.com/reference/introduction) — market
  data, no key required for the free tier
- [Binance REST API](https://developers.binance.com/docs/binance-spot-api-docs/rest-api) —
  candlesticks with volume for coins listed on Binance
- [Binance WebSocket streams](https://developers.binance.com/docs/binance-spot-api-docs/web-socket-streams) — live trade ticks, no auth required
