import type { CoinGeckoMarketDto } from '@/types/coingecko';
import type { CoinListing } from '@/types/market';

export const coinGeckoMarketsResponse: CoinGeckoMarketDto[] = [
    {
        id: 'bitcoin',
        symbol: 'btc',
        name: 'Bitcoin',
        current_price: 64250.12,
        market_cap: 1_265_000_000_000,
        price_change_percentage_24h: 2.345,
    },
    {
        id: 'litecoin',
        symbol: 'ltc',
        name: 'Litecoin',
        current_price: 68.4,
        market_cap: 5_120_000_000,
        price_change_percentage_24h: -1.2,
    },
    {
        id: 'new-listing',
        symbol: 'new',
        name: 'New Listing',
        current_price: 0.000123456,
        market_cap: 1_500_000,
        price_change_percentage_24h: null,
    },
];

export const coinListings: CoinListing[] = [
    {
        id: 'bitcoin',
        symbol: 'btc',
        name: 'Bitcoin',
        price: 64250.12,
        change24h: 2.345,
        marketCap: 1_265_000_000_000,
    },
    {
        id: 'litecoin',
        symbol: 'ltc',
        name: 'Litecoin',
        price: 68.4,
        change24h: -1.2,
        marketCap: 5_120_000_000,
    },
    {
        id: 'new-listing',
        symbol: 'new',
        name: 'New Listing',
        price: 0.000123456,
        change24h: 0,
        marketCap: 1_500_000,
    },
];
