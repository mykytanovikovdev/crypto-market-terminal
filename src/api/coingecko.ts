import { createHttpClient } from '@/api/http';
import type { CoinGeckoMarketDto, CoinGeckoOhlcRow } from '@/types/coingecko';
import type { Candle, CoinListing } from '@/types/market';

const COINGECKO_BASE_URL = 'https://api.coingecko.com/api/v3';
const QUOTE_CURRENCY = 'usd';

export const coinGeckoClient = createHttpClient(COINGECKO_BASE_URL);

export function mapMarketDtoToCoinListing(dto: CoinGeckoMarketDto): CoinListing {
    return {
        id: dto.id,
        symbol: dto.symbol,
        name: dto.name,
        price: dto.current_price,
        change24h: dto.price_change_percentage_24h ?? 0,
        marketCap: dto.market_cap,
    };
}

export function mapOhlcRowToCandle([
    timestampMs,
    open,
    high,
    low,
    close,
]: CoinGeckoOhlcRow): Candle {
    return {
        time: Math.floor(timestampMs / 1000),
        open,
        high,
        low,
        close,
    };
}

export async function fetchTopCoins(limit = 50): Promise<CoinListing[]> {
    const { data } = await coinGeckoClient.get<CoinGeckoMarketDto[]>('/coins/markets', {
        params: {
            vs_currency: QUOTE_CURRENCY,
            order: 'market_cap_desc',
            per_page: limit,
            page: 1,
        },
    });

    return data.map(mapMarketDtoToCoinListing);
}

export async function fetchCandles(coinId: string, days = 1): Promise<Candle[]> {
    const { data } = await coinGeckoClient.get<CoinGeckoOhlcRow[]>(`/coins/${coinId}/ohlc`, {
        params: { vs_currency: QUOTE_CURRENCY, days },
    });

    return data.map(mapOhlcRowToCandle);
}
