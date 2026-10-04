import { createHttpClient } from '@/api/http';
import type { CoinGeckoMarketDto, CoinGeckoOhlcRow } from '@/types/coingecko';
import type { Candle, CoinListing } from '@/types/market';

const COINGECKO_BASE_URL = 'https://api.coingecko.com/api/v3';
const QUOTE_CURRENCY = 'usd';

export const TOP_COINS_LIMIT = 50;

export const coinGeckoClient = createHttpClient(COINGECKO_BASE_URL);

export function mapMarketDtoToCoinListing(dto: CoinGeckoMarketDto): CoinListing {
    return {
        id: dto.id,
        rank: dto.market_cap_rank,
        symbol: dto.symbol,
        name: dto.name,
        imageUrl: dto.image,
        price: dto.current_price,
        change1h: dto.price_change_percentage_1h_in_currency ?? null,
        change24h: dto.price_change_percentage_24h_in_currency ?? null,
        change7d: dto.price_change_percentage_7d_in_currency ?? null,
        marketCap: dto.market_cap,
        volume24h: dto.total_volume,
        circulatingSupply: dto.circulating_supply,
        sparkline7d: dto.sparkline_in_7d?.price ?? [],
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

export async function fetchTopCoins(limit = TOP_COINS_LIMIT): Promise<CoinListing[]> {
    const { data } = await coinGeckoClient.get<CoinGeckoMarketDto[]>('/coins/markets', {
        params: {
            vs_currency: QUOTE_CURRENCY,
            order: 'market_cap_desc',
            per_page: limit,
            page: 1,
            sparkline: true,
            price_change_percentage: '1h,24h,7d',
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
