export default {
    marketOverview: {
        summary: 'No instruments | {count} instrument | {count} instruments',
        loading: 'Loading market data…',
        empty: 'No instruments to show.',
        retry: 'Retry',
    },
    marketTable: {
        columns: {
            instrument: 'Instrument',
            price: 'Price',
            change24h: '24h',
            marketCap: 'Mkt cap',
            watchlist: 'Watchlist',
        },
        addToWatchlist: 'Add {name} to watchlist',
        removeFromWatchlist: 'Remove {name} from watchlist',
    },
    errors: {
        rateLimited: 'CoinGecko rate limit reached. Try again in a minute.',
        network: 'Could not reach CoinGecko. Check your connection and retry.',
        http: 'CoinGecko responded with an error ({status}).',
        unknown: 'Something went wrong while loading market data.',
    },
};
