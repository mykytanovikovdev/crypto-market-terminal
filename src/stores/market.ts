import { defineStore } from 'pinia';
import { computed, ref, watch } from 'vue';
import { fetchCoinsByIds, fetchTopCoins, TOP_COINS_LIMIT } from '@/api/coingecko';
import { useAsyncResource } from '@/composables/useAsyncResource';
import type { CoinListing } from '@/types/market';
import { readStorage, STORAGE_KEYS, writeStorage } from '@/utils/storage';

const CACHE_TTL_MS = 60_000;

function readSavedWatchlist(): string[] {
    const savedWatchlist = readStorage(STORAGE_KEYS.watchlist);

    if (!savedWatchlist) {
        return [];
    }

    try {
        const parsed: unknown = JSON.parse(savedWatchlist);

        return Array.isArray(parsed) ? parsed.filter((id) => typeof id === 'string') : [];
    } catch {
        return [];
    }
}

export const useMarketStore = defineStore('market', () => {
    const topCoins = useAsyncResource(fetchTopCoins, [] as CoinListing[]);
    const loadedLimit = ref<number>(TOP_COINS_LIMIT);

    const watchlist = ref<string[]>(readSavedWatchlist());
    const watchlistCoins = useAsyncResource(fetchCoinsByIds, [] as CoinListing[]);

    const watchedCoins = computed(() =>
        watchlistCoins.data.value.filter((coin) => watchlist.value.includes(coin.id)),
    );

    async function loadTopCoins(limit: number = loadedLimit.value): Promise<void> {
        loadedLimit.value = limit;
        await topCoins.load(limit);
    }

    async function refreshTopCoins(limit: number = TOP_COINS_LIMIT): Promise<void> {
        const hasFreshData =
            limit === loadedLimit.value &&
            topCoins.data.value.length > 0 &&
            topCoins.isFresh(CACHE_TTL_MS);

        if (!hasFreshData) {
            await loadTopCoins(limit);
        }
    }

    async function loadWatchedCoins(): Promise<void> {
        await watchlistCoins.load([...watchlist.value]);
    }

    async function refreshWatchedCoins(): Promise<void> {
        const loadedIds = new Set(watchlistCoins.data.value.map((coin) => coin.id));
        const hasAllWatchedCoins = watchlist.value.every((coinId) => loadedIds.has(coinId));

        if (!hasAllWatchedCoins || !watchlistCoins.isFresh(CACHE_TTL_MS)) {
            await loadWatchedCoins();
        }
    }

    function isWatched(coinId: string): boolean {
        return watchlist.value.includes(coinId);
    }

    function toggleWatch(coinId: string): void {
        watchlist.value = isWatched(coinId)
            ? watchlist.value.filter((watchedId) => watchedId !== coinId)
            : [...watchlist.value, coinId];
    }

    function saveWatchlist(ids: string[]): void {
        writeStorage(STORAGE_KEYS.watchlist, JSON.stringify(ids));
    }

    watch(watchlist, saveWatchlist);

    return {
        coins: topCoins.data,
        isLoading: topCoins.isLoading,
        loadError: topCoins.error,
        lastUpdatedAt: topCoins.updatedAt,
        loadedLimit,
        watchlist,
        watchedCoins,
        isWatchlistLoading: watchlistCoins.isLoading,
        watchlistError: watchlistCoins.error,
        loadTopCoins,
        refreshTopCoins,
        loadWatchedCoins,
        refreshWatchedCoins,
        isWatched,
        toggleWatch,
    };
});
