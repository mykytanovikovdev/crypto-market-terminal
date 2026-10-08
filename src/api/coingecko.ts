import { createHttpClient } from '@/api/http';
import type { CoinDetails, CoinLink, PriceExtreme } from '@/types/coin';
import type {
    CoinGeckoCoinDetailsDto,
    CoinGeckoMarketDto,
    CoinGeckoOhlcRow,
} from '@/types/coingecko';
import type { Candle, CoinListing } from '@/types/market';
import { htmlToParagraphs } from '@/utils/text';
import { isSafeHttpUrl } from '@/utils/url';

const COINGECKO_BASE_URL = 'https://api.coingecko.com/api/v3';
const QUOTE_CURRENCY = 'usd';

export const TOP_COINS_LIMIT = 50;
export const TOP_COINS_LIMIT_OPTIONS = [50, 100] as const;

const MARKET_DATA_PARAMS = {
    vs_currency: QUOTE_CURRENCY,
    order: 'market_cap_desc',
    sparkline: true,
    price_change_percentage: '1h,24h,7d',
} as const;

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
        volume: null,
    };
}

export async function fetchTopCoins(limit = TOP_COINS_LIMIT): Promise<CoinListing[]> {
    const { data } = await coinGeckoClient.get<CoinGeckoMarketDto[]>('/coins/markets', {
        params: { ...MARKET_DATA_PARAMS, per_page: limit, page: 1 },
    });

    return data.map(mapMarketDtoToCoinListing);
}

export async function fetchCoinsByIds(ids: string[]): Promise<CoinListing[]> {
    if (ids.length === 0) {
        return [];
    }

    const { data } = await coinGeckoClient.get<CoinGeckoMarketDto[]>('/coins/markets', {
        params: { ...MARKET_DATA_PARAMS, ids: ids.join(','), per_page: ids.length, page: 1 },
    });

    return data.map(mapMarketDtoToCoinListing);
}

export async function fetchCoinGeckoCandles(coinId: string, days: number): Promise<Candle[]> {
    const { data } = await coinGeckoClient.get<CoinGeckoOhlcRow[]>(`/coins/${coinId}/ohlc`, {
        params: { vs_currency: QUOTE_CURRENCY, days },
    });

    return data.map(mapOhlcRowToCandle);
}

function toPriceExtreme(
    price: number | null | undefined,
    date: string | null | undefined,
    changePercent: number | null | undefined,
): PriceExtreme | null {
    if (price === null || price === undefined || !date) {
        return null;
    }

    return { price, date: new Date(date), changePercent: changePercent ?? 0 };
}

function collectLinks(links: CoinGeckoCoinDetailsDto['links']): CoinLink[] {
    const candidates: CoinLink[] = [
        { kind: 'website', url: links.homepage[0] ?? '' },
        { kind: 'whitepaper', url: links.whitepaper ?? '' },
        { kind: 'explorer', url: links.blockchain_site[0] ?? '' },
        { kind: 'github', url: links.repos_url.github[0] ?? '' },
        { kind: 'reddit', url: links.subreddit_url ?? '' },
    ];

    return candidates.filter((link) => isSafeHttpUrl(link.url));
}

export function mapCoinDetailsDto(dto: CoinGeckoCoinDetailsDto): CoinDetails {
    const market = dto.market_data;

    return {
        id: dto.id,
        symbol: dto.symbol,
        name: dto.name,
        imageUrl: dto.image.large,
        rank: dto.market_cap_rank,
        price: market.current_price.usd ?? 0,
        change1h: market.price_change_percentage_1h_in_currency.usd ?? null,
        change24h: market.price_change_percentage_24h_in_currency.usd ?? null,
        change7d: market.price_change_percentage_7d_in_currency.usd ?? null,
        change30d: market.price_change_percentage_30d_in_currency.usd ?? null,
        change1y: market.price_change_percentage_1y_in_currency.usd ?? null,
        marketCap: market.market_cap.usd ?? 0,
        volume24h: market.total_volume.usd ?? 0,
        fullyDilutedValuation: market.fully_diluted_valuation.usd ?? null,
        high24h: market.high_24h.usd ?? null,
        low24h: market.low_24h.usd ?? null,
        circulatingSupply: market.circulating_supply ?? 0,
        maxSupply: market.max_supply,
        allTimeHigh: toPriceExtreme(
            market.ath.usd,
            market.ath_date.usd,
            market.ath_change_percentage.usd,
        ),
        allTimeLow: toPriceExtreme(
            market.atl.usd,
            market.atl_date.usd,
            market.atl_change_percentage.usd,
        ),
        descriptionParagraphs: htmlToParagraphs(dto.description.en ?? ''),
        links: collectLinks(dto.links),
    };
}

export async function fetchCoinDetails(coinId: string): Promise<CoinDetails> {
    const { data } = await coinGeckoClient.get<CoinGeckoCoinDetailsDto>(`/coins/${coinId}`, {
        params: {
            localization: false,
            tickers: false,
            community_data: false,
            developer_data: false,
            sparkline: false,
        },
    });

    return mapCoinDetailsDto(data);
}
