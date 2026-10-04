import type { AxiosResponse } from 'axios';
import { describe, expect, it, vi } from 'vitest';
import { coinGeckoClient, fetchTopCoins, mapOhlcRowToCandle } from '@/api/coingecko';
import { coinGeckoMarketsResponse, coinListings } from '../../fixtures/coingecko';

describe('fetchTopCoins', () => {
    it('requests coins ordered by market cap and maps them to listings', async () => {
        const getSpy = vi
            .spyOn(coinGeckoClient, 'get')
            .mockResolvedValue({ data: coinGeckoMarketsResponse } as AxiosResponse);

        const listings = await fetchTopCoins(3);

        expect(getSpy).toHaveBeenCalledWith('/coins/markets', {
            params: { vs_currency: 'usd', order: 'market_cap_desc', per_page: 3, page: 1 },
        });
        expect(listings).toEqual(coinListings);
    });
});

describe('mapOhlcRowToCandle', () => {
    it('converts the millisecond timestamp to unix seconds', () => {
        expect(mapOhlcRowToCandle([1_700_000_000_500, 1, 3, 0.5, 2])).toEqual({
            time: 1_700_000_000,
            open: 1,
            high: 3,
            low: 0.5,
            close: 2,
        });
    });
});
