import type { AxiosResponse } from 'axios';
import { describe, expect, it, vi } from 'vitest';
import {
    coinGeckoClient,
    fetchCoinsByIds,
    fetchTopCoins,
    mapOhlcRowToCandle,
} from '@/api/coingecko';
import { coinGeckoMarketsResponse, coinListings } from '../../fixtures/coingecko';

describe('fetchTopCoins', () => {
    it('requests market data with sparklines and multi-period changes', async () => {
        const getSpy = vi
            .spyOn(coinGeckoClient, 'get')
            .mockResolvedValue({ data: coinGeckoMarketsResponse } as AxiosResponse);

        await fetchTopCoins(3);

        expect(getSpy).toHaveBeenCalledWith('/coins/markets', {
            params: {
                vs_currency: 'usd',
                order: 'market_cap_desc',
                per_page: 3,
                page: 1,
                sparkline: true,
                price_change_percentage: '1h,24h,7d',
            },
        });
    });

    it('maps DTOs to listings and fills missing values with null or empty data', async () => {
        vi.spyOn(coinGeckoClient, 'get').mockResolvedValue({
            data: coinGeckoMarketsResponse,
        } as AxiosResponse);

        expect(await fetchTopCoins(3)).toEqual(coinListings);
    });
});

describe('fetchCoinsByIds', () => {
    it('requests only the given coins', async () => {
        const getSpy = vi
            .spyOn(coinGeckoClient, 'get')
            .mockResolvedValue({ data: coinGeckoMarketsResponse.slice(0, 2) } as AxiosResponse);

        const listings = await fetchCoinsByIds(['bitcoin', 'litecoin']);

        expect(getSpy).toHaveBeenCalledWith(
            '/coins/markets',
            expect.objectContaining({
                params: expect.objectContaining({ ids: 'bitcoin,litecoin', per_page: 2 }),
            }),
        );
        expect(listings.map((coin) => coin.id)).toEqual(['bitcoin', 'litecoin']);
    });

    it('skips the request for an empty list', async () => {
        const getSpy = vi.spyOn(coinGeckoClient, 'get');

        expect(await fetchCoinsByIds([])).toEqual([]);
        expect(getSpy).not.toHaveBeenCalled();
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
