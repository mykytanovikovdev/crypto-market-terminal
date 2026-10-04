<script setup lang="ts">
import { onMounted } from 'vue';
import { useMarketStore } from './stores/market';

const market = useMarketStore();
onMounted(() => market.loadTopCoins());

function fmtPrice(n: number) {
  return n >= 1000 ? n.toLocaleString('en-US', { maximumFractionDigits: 0 }) : n.toFixed(2);
}
</script>

<template>
  <div class="terminal">
    <header class="topbar">
      <h1>MARKET<span class="amber-dot">.</span>TERMINAL</h1>
      <span class="meta mono">{{ market.coins.length }} instruments · live</span>
    </header>

    <table class="board">
      <thead>
        <tr>
          <th>Instrument</th>
          <th class="num">Price</th>
          <th class="num">24h</th>
          <th class="num">Mkt Cap</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="c in market.coins" :key="c.id">
          <td>
            <span class="name">{{ c.name }}</span>
            <span class="symbol mono">{{ c.symbol.toUpperCase() }}</span>
          </td>
          <td class="num mono">${{ fmtPrice(c.price) }}</td>
          <td class="num mono" :class="c.change24h >= 0 ? 'up' : 'down'">
            {{ c.change24h >= 0 ? '+' : '' }}{{ c.change24h.toFixed(2) }}%
          </td>
          <td class="num mono">${{ (c.marketCap / 1e9).toFixed(1) }}B</td>
          <td class="watch" @click="market.toggleWatch(c.id)">
            {{ market.watchlist.includes(c.id) ? '★' : '☆' }}
          </td>
        </tr>
      </tbody>
    </table>

    <p v-if="market.loading" class="meta mono">loading…</p>
  </div>
</template>

<style scoped>
.terminal {
  max-width: 960px;
  margin: 0 auto;
  padding: 32px 24px 64px;
}

.topbar {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  border-bottom: 1px solid var(--line);
  padding-bottom: 16px;
  margin-bottom: 8px;
}

.topbar h1 {
  font-size: 20px;
  letter-spacing: 0.02em;
}

.amber-dot { color: var(--amber); }

.meta { color: var(--text-dim); font-size: 13px; }

.board { width: 100%; border-collapse: collapse; }

.board th {
  text-align: left;
  font-weight: 500;
  color: var(--text-dim);
  font-size: 12px;
  padding: 10px 8px;
  border-bottom: 1px solid var(--line);
}

.board td {
  padding: 10px 8px;
  border-bottom: 1px solid var(--line);
  font-size: 14px;
}

.board tr:hover td { background: var(--bg-raised); }

.num { text-align: right; }
th.num { text-align: right; }

.symbol {
  color: var(--text-dim);
  font-size: 12px;
  margin-left: 8px;
}

.watch {
  text-align: right;
  color: var(--amber);
  cursor: pointer;
  width: 24px;
}
</style>
