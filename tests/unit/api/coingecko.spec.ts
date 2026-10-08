import type { AxiosResponse } from 'axios';
import { describe, expect, it, vi } from 'vitest';
import {
    coinGeckoClient,
    fetchCoinDetails,
    fetchCoinsByIds,
    fetchTopCoins,
    mapOhlcRowToCandle,
} from '@/api/coingecko';
import { coinGeckoMarketsResponse, coinListings } from '../../fixtures/coingecko';
import { coinDetails, coinDetailsResponse } from '../../fixtures/coinDetails';

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
            volume: null,
        });
    });
});

describe('fetchCoinDetails', () => {
    it('requests only the market data and maps it to coin details', async () => {
        const getSpy = vi
            .spyOn(coinGeckoClient, 'get')
            .mockResolvedValue({ data: coinDetailsResponse } as AxiosResponse);

        const details = await fetchCoinDetails('bitcoin');

        expect(getSpy).toHaveBeenCalledWith('/coins/bitcoin', {
            params: expect.objectContaining({ tickers: false, community_data: false }),
        });
        expect(details).toEqual(coinDetails);
    });

    it('drops links that are empty or not http(s)', async () => {
        vi.spyOn(coinGeckoClient, 'get').mockResolvedValue({
            data: coinDetailsResponse,
        } as AxiosResponse);

        const { links } = await fetchCoinDetails('bitcoin');

        expect(links.map((link) => link.kind)).not.toContain('explorer');
    });
});
