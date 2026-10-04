import { defineStore } from 'pinia';
import { ref } from 'vue';
import { fetchTopCoins } from '@/api/coingecko';
import { toApiError, type ApiError } from '@/api/http';
import type { CoinListing } from '@/types/market';

export const useMarketStore = defineStore('market', () => {
    const coins = ref<CoinListing[]>([]);
    const watchlist = ref<string[]>([]);
    const isLoading = ref<boolean>(false);
    const loadError = ref<ApiError | null>(null);

    async function loadTopCoins(): Promise<void> {
        isLoading.value = true;
        loadError.value = null;

        try {
            coins.value = await fetchTopCoins();
        } catch (error) {
            loadError.value = toApiError(error);
        } finally {
            isLoading.value = false;
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

    return { coins, watchlist, isLoading, loadError, loadTopCoins, isWatched, toggleWatch };
});
