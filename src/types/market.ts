export interface CoinListing {
  id: string;          // CoinGecko id, e.g. "bitcoin"
  symbol: string;       // e.g. "btc"
  name: string;
  price: number;
  change24h: number;    // percent
  marketCap: number;
}

export interface Candle {
  time: number;  // unix seconds
  open: number;
  high: number;
  low: number;
  close: number;
}

export interface TickerUpdate {
  symbol: string; // Binance symbol, e.g. "BTCUSDT"
  price: number;
}
