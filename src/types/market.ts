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
    lastPrice: number;
    openPrice: number;
}

export interface LiveQuote {
    price: number;
    change24h: number;
}

export type LiveConnectionStatus =
    'idle' | 'connecting' | 'live' | 'reconnecting' | 'paused' | 'unavailable';

export type PriceDirection = 'up' | 'down' | 'flat';

export type SortKey =
    | 'rank'
    | 'name'
    | 'price'
    | 'change1h'
    | 'change24h'
    | 'change7d'
    | 'marketCap'
    | 'volume24h'
    | 'circulatingSupply';

export type SortDirection = 'asc' | 'desc';

export interface SortState {
    key: SortKey;
    direction: SortDirection;
}

export type MovementFilter = 'all' | 'gainers' | 'losers';
