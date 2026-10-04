import { createPinia, setActivePinia } from 'pinia';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { fetchTopCoins } from '@/api/coingecko';
import { ApiError } from '@/api/http';
import { useMarketStore } from '@/stores/market';
import { coinListings } from '../../fixtures/coingecko';

vi.mock('@/api/coingecko', () => ({ fetchTopCoins: vi.fn() }));

describe('market store', () => {
    beforeEach(() => {
        setActivePinia(createPinia());
    });

    it('stores loaded coins and clears the loading flag', async () => {
        vi.mocked(fetchTopCoins).mockResolvedValue(coinListings);
        const store = useMarketStore();

        await store.loadTopCoins();

        expect(store.coins).toEqual(coinListings);
        expect(store.isLoading).toBe(false);
        expect(store.loadError).toBeNull();
    });

    it('keeps the API error when loading fails', async () => {
        vi.mocked(fetchTopCoins).mockRejectedValue(new ApiError('rateLimited', 'Too many', 429));
        const store = useMarketStore();

        await store.loadTopCoins();

        expect(store.coins).toEqual([]);
        expect(store.loadError?.kind).toBe('rateLimited');
        expect(store.isLoading).toBe(false);
    });

    it('toggles a coin in and out of the watchlist', () => {
        const store = useMarketStore();

        store.toggleWatch('bitcoin');
        expect(store.isWatched('bitcoin')).toBe(true);

        store.toggleWatch('bitcoin');
        expect(store.isWatched('bitcoin')).toBe(false);
    });
});
