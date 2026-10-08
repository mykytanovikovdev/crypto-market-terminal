import type { CoinGeckoCoinDetailsDto } from '@/types/coingecko';
import type { CoinDetails } from '@/types/coin';
import type { Candle } from '@/types/market';

export const coinDetailsResponse: CoinGeckoCoinDetailsDto = {
    id: 'bitcoin',
    symbol: 'btc',
    name: 'Bitcoin',
    image: {
        large: 'https://example.test/bitcoin-large.png',
        small: 'https://example.test/bitcoin-small.png',
        thumb: 'https://example.test/bitcoin-thumb.png',
    },
    market_cap_rank: 1,
    description: {
        en: 'Bitcoin is the first <a href="https://example.test">decentralized</a> currency.\r\n\r\nIt was created in 2009 &amp; launched by Satoshi.',
    },
    links: {
        homepage: ['https://bitcoin.org', ''],
        whitepaper: 'https://bitcoin.org/bitcoin.pdf',
        blockchain_site: ['javascript:alert(1)'],
        subreddit_url: 'https://reddit.com/r/bitcoin',
        repos_url: { github: ['https://github.com/bitcoin/bitcoin'] },
    },
    market_data: {
        current_price: { usd: 85000 },
        market_cap: { usd: 1_700_000_000_000 },
        total_volume: { usd: 22_000_000_000 },
        fully_diluted_valuation: { usd: 1_785_000_000_000 },
        high_24h: { usd: 86000 },
        low_24h: { usd: 84000 },
        price_change_percentage_1h_in_currency: { usd: 0.2 },
        price_change_percentage_24h_in_currency: { usd: 1.1 },
        price_change_percentage_7d_in_currency: { usd: 2.6 },
        price_change_percentage_30d_in_currency: { usd: -4.1 },
        price_change_percentage_1y_in_currency: {},
        circulating_supply: 20_000_000,
        max_supply: 21_000_000,
        ath: { usd: 126080 },
        ath_date: { usd: '2025-10-06T10:57:42.000Z' },
        ath_change_percentage: { usd: -32.2 },
        atl: { usd: 67.81 },
        atl_date: { usd: '2013-07-05T00:00:00.000Z' },
        atl_change_percentage: { usd: 125000 },
    },
};

export const coinDetails: CoinDetails = {
    id: 'bitcoin',
    symbol: 'btc',
    name: 'Bitcoin',
    imageUrl: 'https://example.test/bitcoin-large.png',
    rank: 1,
    price: 85000,
    change1h: 0.2,
    change24h: 1.1,
    change7d: 2.6,
    change30d: -4.1,
    change1y: null,
    marketCap: 1_700_000_000_000,
    volume24h: 22_000_000_000,
    fullyDilutedValuation: 1_785_000_000_000,
    high24h: 86000,
    low24h: 84000,
    circulatingSupply: 20_000_000,
    maxSupply: 21_000_000,
    allTimeHigh: {
        price: 126080,
        date: new Date('2025-10-06T10:57:42.000Z'),
        changePercent: -32.2,
    },
    allTimeLow: { price: 67.81, date: new Date('2013-07-05T00:00:00.000Z'), changePercent: 125000 },
    descriptionParagraphs: [
        'Bitcoin is the first decentralized currency.',
        'It was created in 2009 & launched by Satoshi.',
    ],
    links: [
        { kind: 'website', url: 'https://bitcoin.org' },
        { kind: 'whitepaper', url: 'https://bitcoin.org/bitcoin.pdf' },
        { kind: 'github', url: 'https://github.com/bitcoin/bitcoin' },
        { kind: 'reddit', url: 'https://reddit.com/r/bitcoin' },
    ],
};

const HOUR_SECONDS = 3600;
const START_SECONDS = 1_790_000_000 - (1_790_000_000 % HOUR_SECONDS);

export function createHourlyCandles(closes: number[], withVolume = true): Candle[] {
    return closes.map((close, index) => ({
        time: START_SECONDS + index * HOUR_SECONDS,
        open: index === 0 ? close : (closes[index - 1] ?? close),
        high: close + 10,
        low: close - 10,
        close,
        volume: withVolume ? 100 + index : null,
    }));
}
