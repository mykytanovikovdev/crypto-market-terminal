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

interface UsdValue {
    usd?: number | null;
}

interface UsdDate {
    usd?: string | null;
}

export interface CoinGeckoCoinDetailsDto {
    id: string;
    symbol: string;
    name: string;
    image: { large: string; small: string; thumb: string };
    market_cap_rank: number | null;
    description: { en?: string | null };
    links: {
        homepage: string[];
        whitepaper?: string | null;
        blockchain_site: string[];
        subreddit_url?: string | null;
        repos_url: { github: string[] };
    };
    market_data: {
        current_price: UsdValue;
        market_cap: UsdValue;
        total_volume: UsdValue;
        fully_diluted_valuation: UsdValue;
        high_24h: UsdValue;
        low_24h: UsdValue;
        price_change_percentage_1h_in_currency: UsdValue;
        price_change_percentage_24h_in_currency: UsdValue;
        price_change_percentage_7d_in_currency: UsdValue;
        price_change_percentage_30d_in_currency: UsdValue;
        price_change_percentage_1y_in_currency: UsdValue;
        circulating_supply: number | null;
        max_supply: number | null;
        ath: UsdValue;
        ath_date: UsdDate;
        ath_change_percentage: UsdValue;
        atl: UsdValue;
        atl_date: UsdDate;
        atl_change_percentage: UsdValue;
    };
}
