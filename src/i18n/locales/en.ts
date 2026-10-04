export default {
    app: {
        skipToContent: 'Skip to content',
        pageTitle: "{page} {'|'} Market Terminal",
    },
    nav: {
        label: 'Main',
        markets: 'Markets',
        watchlist: 'Watchlist',
        about: 'About',
    },
    language: {
        label: 'Language',
    },
    theme: {
        switchToDark: 'Switch to dark theme',
        switchToLight: 'Switch to light theme',
    },
    requestState: {
        loading: 'Loading market data…',
        empty: 'No coins to show.',
        retry: 'Try again',
    },
    markets: {
        title: "Today's cryptocurrency prices",
        description: 'The top {count} coins by market capitalization, priced in US dollars.',
        updatedAt: 'Updated at {time}',
    },
    watchlist: {
        title: 'Watchlist',
        description: 'Coins you starred on the Markets page.',
        emptyTitle: 'Your watchlist is empty',
        emptyText: 'Star a coin on the Markets page and it will appear here.',
        emptyAction: 'Go to Markets',
    },
    about: {
        title: 'About Market Terminal',
        intro: 'Market Terminal shows the largest cryptocurrencies by market capitalization: current price, short-term change, trading volume and the last seven days at a glance.',
        dataTitle: 'Data',
        dataText:
            'Market data comes from the CoinGecko public API and is refreshed each time you open the Markets page.',
        stackTitle: 'Built with',
        sourceTitle: 'Source code',
        sourceLink: 'View the repository on GitHub',
        disclaimer: 'Prices are for information only and are not financial advice.',
    },
    marketTable: {
        caption: 'Cryptocurrency prices',
        columns: {
            watch: 'Watchlist',
            rank: 'Rank',
            name: 'Name',
            price: 'Price',
            change1h: '1h %',
            change24h: '24h %',
            change7d: '7d %',
            marketCap: 'Market cap',
            volume24h: 'Volume (24h)',
            circulatingSupply: 'Circulating supply',
            last7Days: 'Last 7 days',
        },
        addToWatchlist: 'Add {name} to watchlist',
        removeFromWatchlist: 'Remove {name} from watchlist',
        sparklineLabel: '{name} price over the last 7 days',
    },
    priceChange: {
        up: 'Up',
        down: 'Down',
        notAvailable: 'Not available',
    },
    errors: {
        rateLimited: 'CoinGecko rate limit reached. Try again in a minute.',
        network: 'Could not reach CoinGecko. Check your connection and try again.',
        http: 'CoinGecko responded with an error ({status}).',
        unknown: 'Something went wrong while loading market data.',
    },
};
