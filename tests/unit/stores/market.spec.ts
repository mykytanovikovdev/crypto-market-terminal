import { createPinia, setActivePinia } from 'pinia';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { nextTick } from 'vue';
import { fetchCoinsByIds, fetchTopCoins } from '@/api/coingecko';
import { ApiError } from '@/api/http';
import { useMarketStore } from '@/stores/market';
import { STORAGE_KEYS } from '@/utils/storage';
import { coinListings } from '../../fixtures/coingecko';

vi.mock('@/api/coingecko', () => ({
    TOP_COINS_LIMIT: 50,
    fetchTopCoins: vi.fn(),
    fetchCoinsByIds: vi.fn(),
}));

describe('market store', () => {
    beforeEach(() => {
        localStorage.clear();
        setActivePinia(createPinia());
        vi.mocked(fetchTopCoins).mockResolvedValue(coinListings);
        vi.mocked(fetchCoinsByIds).mockImplementation(async (ids) =>
            coinListings.filter((coin) => ids.includes(coin.id)),
        );
    });

    afterEach(() => {
        vi.useRealTimers();
    });

    describe('top coins', () => {
        it('stores loaded coins and the time of the update', async () => {
            const store = useMarketStore();

            await store.loadTopCoins(50);

            expect(store.coins).toEqual(coinListings);
            expect(store.lastUpdatedAt).toBeInstanceOf(Date);
            expect(store.loadedLimit).toBe(50);
        });

        it('keeps the API error when loading fails', async () => {
            vi.mocked(fetchTopCoins).mockRejectedValue(
                new ApiError('rateLimited', 'Too many', 429),
            );
            const store = useMarketStore();

            await store.loadTopCoins();

            expect(store.coins).toEqual([]);
            expect(store.loadError?.kind).toBe('rateLimited');
            expect(store.isLoading).toBe(false);
        });

        it('reuses fresh data for the same row limit', async () => {
            const store = useMarketStore();

            await store.refreshTopCoins(50);
            await store.refreshTopCoins(50);

            expect(fetchTopCoins).toHaveBeenCalledTimes(1);
        });

        it('reloads when the row limit changes or the cache expires', async () => {
            vi.useFakeTimers();
            const store = useMarketStore();

            await store.refreshTopCoins(50);
            await store.refreshTopCoins(100);
            vi.advanceTimersByTime(60_001);
            await store.refreshTopCoins(100);

            expect(fetchTopCoins).toHaveBeenNthCalledWith(1, 50);
            expect(fetchTopCoins).toHaveBeenNthCalledWith(2, 100);
            expect(fetchTopCoins).toHaveBeenCalledTimes(3);
        });
    });

    describe('watchlist', () => {
        it('toggles a coin in and out of the watchlist', () => {
            const store = useMarketStore();

            store.toggleWatch('bitcoin');
            expect(store.isWatched('bitcoin')).toBe(true);

            store.toggleWatch('bitcoin');
            expect(store.isWatched('bitcoin')).toBe(false);
        });

        it('loads watched coins by id, independent of the top list', async () => {
            const store = useMarketStore();
            store.toggleWatch('litecoin');

            await store.refreshWatchedCoins();

            expect(fetchCoinsByIds).toHaveBeenCalledWith(['litecoin']);
            expect(fetchTopCoins).not.toHaveBeenCalled();
            expect(store.watchedCoins.map((coin) => coin.id)).toEqual(['litecoin']);
        });

        it('removes an unwatched coin right away and refetches only for new ids', async () => {
            const store = useMarketStore();
            store.toggleWatch('bitcoin');
            store.toggleWatch('litecoin');
            await store.refreshWatchedCoins();

            store.toggleWatch('bitcoin');
            await store.refreshWatchedCoins();

            expect(store.watchedCoins.map((coin) => coin.id)).toEqual(['litecoin']);
            expect(fetchCoinsByIds).toHaveBeenCalledTimes(1);

            store.toggleWatch('new-listing');
            await store.refreshWatchedCoins();

            expect(fetchCoinsByIds).toHaveBeenCalledTimes(2);
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
});
