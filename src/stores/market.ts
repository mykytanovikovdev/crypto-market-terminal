import { defineStore } from 'pinia';
import type { CoinListing } from '../types/market';
import { fetchTopCoins } from '../api/coingecko';

export const useMarketStore = defineStore('market', {
  state: () => ({
    coins: [] as CoinListing[],
    watchlist: [] as string[], // coin ids, persisted separately (localStorage) once built
    loading: false,
  }),
  actions: {
    async loadTopCoins() {
      this.loading = true;
      try {
        this.coins = await fetchTopCoins();
      } finally {
        this.loading = false;
      }
    },
    toggleWatch(id: string) {
      const i = this.watchlist.indexOf(id);
      if (i === -1) this.watchlist.push(id);
      else this.watchlist.splice(i, 1);
    },
  },
});
