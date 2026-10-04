import { createPinia, setActivePinia } from 'pinia';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { nextTick } from 'vue';
import { fetchTopCoins } from '@/api/coingecko';
import { ApiError } from '@/api/http';
import { useMarketStore } from '@/stores/market';
import { STORAGE_KEYS } from '@/utils/storage';
import { coinListings } from '../../fixtures/coingecko';

vi.mock('@/api/coingecko', () => ({ fetchTopCoins: vi.fn() }));

describe('market store', () => {
    beforeEach(() => {
        localStorage.clear();
        setActivePinia(createPinia());
    });

    it('stores loaded coins and the time of the update', async () => {
        vi.mocked(fetchTopCoins).mockResolvedValue(coinListings);
        const store = useMarketStore();

        await store.loadTopCoins();

        expect(store.coins).toEqual(coinListings);
        expect(store.lastUpdatedAt).toBeInstanceOf(Date);
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

    it('loads coins only once when they are already available', async () => {
        vi.mocked(fetchTopCoins).mockResolvedValue(coinListings);
        const store = useMarketStore();

        await store.ensureCoinsLoaded();
        await store.ensureCoinsLoaded();

        expect(fetchTopCoins).toHaveBeenCalledTimes(1);
    });

    it('toggles a coin in and out of the watchlist', () => {
        const store = useMarketStore();

        store.toggleWatch('bitcoin');
        expect(store.isWatched('bitcoin')).toBe(true);

        store.toggleWatch('bitcoin');
        expect(store.isWatched('bitcoin')).toBe(false);
    });

    it('exposes only watched coins', async () => {
        vi.mocked(fetchTopCoins).mockResolvedValue(coinListings);
        const store = useMarketStore();

        await store.loadTopCoins();
        store.toggleWatch('litecoin');

        expect(store.watchedCoins.map((coin) => coin.id)).toEqual(['litecoin']);
    });

    it('saves the watchlist and restores it in a new session', async () => {
        useMarketStore().toggleWatch('bitcoin');
        await nextTick();

        expect(localStorage.getItem(STORAGE_KEYS.watchlist)).toBe('["bitcoin"]');

        setActivePinia(createPinia());
        expect(useMarketStore().watchlist).toEqual(['bitcoin']);
    });

    it('ignores a corrupted saved watchlist', () => {
        localStorage.setItem(STORAGE_KEYS.watchlist, '{not json');

        expect(useMarketStore().watchlist).toEqual([]);
    });
});
