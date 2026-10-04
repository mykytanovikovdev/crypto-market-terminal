// Thin client for CoinGecko's free tier (no API key needed, ~30 req/min).
// Docs: https://docs.coingecko.com/reference/introduction
import type { CoinListing, Candle } from '../types/market';

const BASE = 'https://api.coingecko.com/api/v3';

export async function fetchTopCoins(limit = 50): Promise<CoinListing[]> {
  const url = `${BASE}/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=${limit}&page=1`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`CoinGecko error ${res.status}`);
  const data = await res.json();
  return data.map((c: any): CoinListing => ({
    id: c.id,
    symbol: c.symbol,
    name: c.name,
    price: c.current_price,
    change24h: c.price_change_percentage_24h ?? 0,
    marketCap: c.market_cap,
  }));
}

export async function fetchCandles(coinId: string, days = 1): Promise<Candle[]> {
  // TODO: CoinGecko's OHLC endpoint — /coins/{id}/ohlc?vs_currency=usd&days={days}
  const url = `${BASE}/coins/${coinId}/ohlc?vs_currency=usd&days=${days}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`CoinGecko error ${res.status}`);
  const data = await res.json();
  return data.map((row: number[]): Candle => ({
    time: Math.floor(row[0] / 1000),
    open: row[1],
    high: row[2],
    low: row[3],
    close: row[4],
  }));
}
