export interface CoinListing {
    id: string;
    symbol: string;
    name: string;
    price: number;
    change24h: number;
    marketCap: number;
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

export type PriceDirection = 'up' | 'down';
