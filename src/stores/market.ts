import { defineStore } from 'pinia';
import { computed, ref, watch } from 'vue';
import { fetchTopCoins } from '@/api/coingecko';
import { toApiError, type ApiError } from '@/api/http';
import type { CoinListing } from '@/types/market';
import { readStorage, STORAGE_KEYS, writeStorage } from '@/utils/storage';

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
    const coins = ref<CoinListing[]>([]);
    const watchlist = ref<string[]>(readSavedWatchlist());
    const isLoading = ref<boolean>(false);
    const loadError = ref<ApiError | null>(null);
    const lastUpdatedAt = ref<Date | null>(null);

    const watchedCoins = computed(() =>
        coins.value.filter((coin) => watchlist.value.includes(coin.id)),
    );

    async function loadTopCoins(): Promise<void> {
        isLoading.value = true;
        loadError.value = null;

        try {
            coins.value = await fetchTopCoins();
            lastUpdatedAt.value = new Date();
        } catch (error) {
            loadError.value = toApiError(error);
        } finally {
            isLoading.value = false;
        }
    }

    async function ensureCoinsLoaded(): Promise<void> {
        if (coins.value.length === 0 && !isLoading.value) {
            await loadTopCoins();
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
        coins,
        watchlist,
        isLoading,
        loadError,
        lastUpdatedAt,
        watchedCoins,
        loadTopCoins,
        ensureCoinsLoaded,
        isWatched,
        toggleWatch,
    };
});
