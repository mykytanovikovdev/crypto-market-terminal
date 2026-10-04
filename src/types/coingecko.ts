export interface CoinGeckoMarketDto {
    id: string;
    symbol: string;
    name: string;
    current_price: number;
    market_cap: number;
    price_change_percentage_24h: number | null;
}

export type CoinGeckoOhlcRow = [
    timestampMs: number,
    open: number,
    high: number,
    low: number,
    close: number,
];
