<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import type { CoinListing } from '@/types/market';
import { formatMarketCap, formatPercentChange, formatPrice } from '@/utils/format';
import { getPriceDirection } from '@/utils/priceDirection';

const props = defineProps<{
    coins: CoinListing[];
    watchlist: string[];
}>();

const emit = defineEmits<{
    toggleWatch: [coinId: string];
}>();

const { t, locale } = useI18n();

function isWatched(coinId: string): boolean {
    return props.watchlist.includes(coinId);
}

function getWatchButtonLabel(coin: CoinListing): string {
    const key = isWatched(coin.id)
        ? 'marketTable.removeFromWatchlist'
        : 'marketTable.addToWatchlist';

    return t(key, { name: coin.name });
}

function handleWatchClick(coinId: string): void {
    emit('toggleWatch', coinId);
}
</script>

<template>
    <table class="market-table">
        <thead>
            <tr>
                <th class="market-table__heading" scope="col">
                    {{ t('marketTable.columns.instrument') }}
                </th>
                <th class="market-table__heading market-table__heading--numeric" scope="col">
                    {{ t('marketTable.columns.price') }}
                </th>
                <th class="market-table__heading market-table__heading--numeric" scope="col">
                    {{ t('marketTable.columns.change24h') }}
                </th>
                <th
                    class="market-table__heading market-table__heading--numeric market-table__heading--market-cap"
                    scope="col"
                >
                    {{ t('marketTable.columns.marketCap') }}
                </th>
                <th class="market-table__heading" scope="col">
                    <span class="visually-hidden">{{ t('marketTable.columns.watchlist') }}</span>
                </th>
            </tr>
        </thead>
        <tbody>
            <tr v-for="coin in coins" :key="coin.id" class="market-table__row">
                <th class="market-table__cell market-table__cell--instrument" scope="row">
                    <span class="market-table__name">{{ coin.name }}</span>
                    <span class="market-table__symbol">{{ coin.symbol }}</span>
                </th>
                <td class="market-table__cell market-table__cell--numeric">
                    {{ formatPrice(coin.price, locale) }}
                </td>
                <td
                    class="market-table__cell market-table__cell--numeric"
                    :class="`market-table__cell--${getPriceDirection(coin.change24h)}`"
                >
                    {{ formatPercentChange(coin.change24h, locale) }}
                </td>
                <td
                    class="market-table__cell market-table__cell--numeric market-table__cell--market-cap"
                >
                    {{ formatMarketCap(coin.marketCap, locale) }}
                </td>
                <td class="market-table__cell market-table__cell--action">
                    <button
                        type="button"
                        class="market-table__watch-button"
                        :aria-pressed="isWatched(coin.id)"
                        :aria-label="getWatchButtonLabel(coin)"
                        @click="handleWatchClick(coin.id)"
                    >
                        {{ isWatched(coin.id) ? '★' : '☆' }}
                    </button>
                </td>
            </tr>
        </tbody>
    </table>
</template>

<style lang="scss" scoped>
@use '@/styles/breakpoints' as *;

.market-table {
    inline-size: 100%;
    border-collapse: collapse;

    &__heading {
        padding-block: var(--space-3);
        padding-inline: var(--space-2);
        border-block-end: 1px solid var(--color-line);
        font-size: var(--font-size-xs);
        font-weight: 500;
        color: var(--color-text-dim);
        text-align: start;

        &--numeric {
            text-align: end;
        }

        &--market-cap {
            display: none;

            @include from(md) {
                display: table-cell;
            }
        }
    }

    &__row:hover {
        background: var(--color-bg-raised);
    }

    &__cell {
        padding-block: var(--space-3);
        padding-inline: var(--space-2);
        border-block-end: 1px solid var(--color-line);
        font-size: var(--font-size-md);

        &--instrument {
            font-weight: 400;
            text-align: start;
        }

        &--numeric {
            font-family: var(--font-mono);
            font-variant-numeric: tabular-nums;
            text-align: end;
        }

        &--up {
            color: var(--color-up);
        }

        &--down {
            color: var(--color-down);
        }

        &--market-cap {
            display: none;

            @include from(md) {
                display: table-cell;
            }
        }

        &--action {
            inline-size: var(--space-8);
            text-align: end;
        }
    }

    &__symbol {
        margin-inline-start: var(--space-2);
        font-family: var(--font-mono);
        font-size: var(--font-size-xs);
        color: var(--color-text-dim);
        text-transform: uppercase;
    }

    &__watch-button {
        padding: 0;
        background: none;
        border: 0;
        color: var(--color-amber);
        cursor: pointer;
    }
}
</style>
