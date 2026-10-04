# Market Terminal

A live crypto market dashboard built with Vue 3 + TypeScript: REST API
integration, real-time data over WebSocket, and a deliberately non-generic UI.

## Features

- Top 50 coins by market cap: price, 1h / 24h / 7d change, market cap, 24h volume,
  circulating supply and a 7-day sparkline
- Watchlist saved in the browser
- English and Persian (right-to-left) interface
- Light and dark themes that follow the system setting by default
- Responsive layout with a sticky coin column on small screens

## Stack

- Vue 3 (Composition API, `<script setup>`), TypeScript, Vite
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

## Data sources

- [CoinGecko API](https://docs.coingecko.com/reference/introduction) — market
  data, no key required for the free tier
- [Binance WebSocket streams](https://developers.binance.com/docs/binance-spot-api-docs/web-socket-streams) — live trade ticks, no auth required
