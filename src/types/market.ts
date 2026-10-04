export interface CoinListing {
    id: string;
    rank: number | null;
    symbol: string;
    name: string;
    imageUrl: string;
    price: number;
    change1h: number | null;
    change24h: number | null;
    change7d: number | null;
    marketCap: number;
    volume24h: number;
    circulatingSupply: number;
    sparkline7d: number[];
}

export interface Candle {
    time: number;
    open: number;
    high: number;
    low: number;
    close: number;
}

export interface TickerUpdate {
    symbol: string;
    price: number;
}

export type PriceDirection = 'up' | 'down' | 'flat';
