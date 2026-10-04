export interface CoinGeckoMarketDto {
    id: string;
    symbol: string;
    name: string;
    image: string;
    market_cap_rank: number | null;
    current_price: number;
    market_cap: number;
    total_volume: number;
    circulating_supply: number;
    price_change_percentage_1h_in_currency?: number | null;
    price_change_percentage_24h_in_currency?: number | null;
    price_change_percentage_7d_in_currency?: number | null;
    sparkline_in_7d?: { price: number[] } | null;
}

export type CoinGeckoOhlcRow = [
    timestampMs: number,
    open: number,
    high: number,
    low: number,
    close: number,
];
