<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import PercentChange from '@/components/PercentChange.vue';
import { useLocale } from '@/composables/useLocale';
import CoinSparkline from '@/features/market-table/CoinSparkline.vue';
import type { CoinListing } from '@/types/market';
import { formatCompactCurrency, formatCompactNumber, formatPrice } from '@/utils/format';

const props = defineProps<{
    coins: CoinListing[];
    watchlist: string[];
}>();

const emit = defineEmits<{
    toggleWatch: [coinId: string];
}>();

const { t } = useI18n();
const { numberLocale } = useLocale();

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
    <div class="market-table">
        <table class="market-table__grid">
            <caption class="visually-hidden">
                {{
                    t('marketTable.caption')
                }}
            </caption>
            <thead>
                <tr>
                    <th class="market-table__heading market-table__heading--watch" scope="col">
                        <span class="visually-hidden">{{ t('marketTable.columns.watch') }}</span>
                    </th>
                    <th class="market-table__heading market-table__heading--rank" scope="col">
                        <abbr :title="t('marketTable.columns.rank')">#</abbr>
                    </th>
                    <th class="market-table__heading market-table__heading--name" scope="col">
                        {{ t('marketTable.columns.name') }}
                    </th>
                    <th class="market-table__heading market-table__heading--numeric" scope="col">
                        {{ t('marketTable.columns.price') }}
                    </th>
                    <th class="market-table__heading market-table__heading--numeric" scope="col">
                        {{ t('marketTable.columns.change1h') }}
                    </th>
                    <th class="market-table__heading market-table__heading--numeric" scope="col">
                        {{ t('marketTable.columns.change24h') }}
                    </th>
                    <th class="market-table__heading market-table__heading--numeric" scope="col">
                        {{ t('marketTable.columns.change7d') }}
                    </th>
                    <th class="market-table__heading market-table__heading--numeric" scope="col">
                        {{ t('marketTable.columns.marketCap') }}
                    </th>
                    <th class="market-table__heading market-table__heading--numeric" scope="col">
                        {{ t('marketTable.columns.volume24h') }}
                    </th>
                    <th class="market-table__heading market-table__heading--numeric" scope="col">
                        {{ t('marketTable.columns.circulatingSupply') }}
                    </th>
                    <th class="market-table__heading market-table__heading--numeric" scope="col">
                        {{ t('marketTable.columns.last7Days') }}
                    </th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="coin in coins" :key="coin.id" class="market-table__row">
                    <td class="market-table__cell market-table__cell--watch">
                        <button
                            type="button"
                            class="market-table__watch-button"
                            :class="{ 'market-table__watch-button--active': isWatched(coin.id) }"
                            :aria-pressed="isWatched(coin.id)"
                            :aria-label="getWatchButtonLabel(coin)"
                            @click="handleWatchClick(coin.id)"
                        >
                            <svg
                                class="market-table__watch-icon"
                                viewBox="0 0 24 24"
                                aria-hidden="true"
                            >
                                <path
                                    d="m12 3 2.76 5.6 6.18.9-4.47 4.36 1.05 6.15L12 17.1l-5.52 2.9 1.05-6.15L3.06 9.5l6.18-.9L12 3Z"
                                />
                            </svg>
                        </button>
                    </td>
                    <td class="market-table__cell market-table__cell--rank">
                        {{ coin.rank ?? '—' }}
                    </td>
                    <th class="market-table__cell market-table__cell--name" scope="row">
                        <span class="market-table__coin">
                            <img
                                class="market-table__logo"
                                :src="coin.imageUrl"
                                alt=""
                                width="24"
                                height="24"
                                loading="lazy"
                            />
                            <span class="market-table__coin-text">
                                <span class="market-table__name" :title="coin.name">
                                    {{ coin.name }}
                                </span>
                                <span class="market-table__symbol">{{ coin.symbol }}</span>
                            </span>
                        </span>
                    </th>
                    <td class="market-table__cell market-table__cell--numeric">
                        <span class="market-table__value">
                            {{ formatPrice(coin.price, numberLocale) }}
                        </span>
                    </td>
                    <td class="market-table__cell market-table__cell--numeric">
                        <PercentChange :value="coin.change1h" :locale="numberLocale" />
                    </td>
                    <td class="market-table__cell market-table__cell--numeric">
                        <PercentChange :value="coin.change24h" :locale="numberLocale" />
                    </td>
                    <td class="market-table__cell market-table__cell--numeric">
                        <PercentChange :value="coin.change7d" :locale="numberLocale" />
                    </td>
                    <td class="market-table__cell market-table__cell--numeric">
                        <span class="market-table__value">
                            {{ formatCompactCurrency(coin.marketCap, numberLocale) }}
                        </span>
                    </td>
                    <td class="market-table__cell market-table__cell--numeric">
                        <span class="market-table__value">
                            {{ formatCompactCurrency(coin.volume24h, numberLocale) }}
                        </span>
                    </td>
                    <td class="market-table__cell market-table__cell--numeric">
                        <span class="market-table__supply">
                            <span class="market-table__value">{{
                                formatCompactNumber(coin.circulatingSupply, numberLocale)
                            }}</span>
                            <span class="market-table__supply-symbol" :title="coin.symbol">
                                {{ coin.symbol }}
                            </span>
                        </span>
                    </td>
                    <td class="market-table__cell market-table__cell--sparkline">
                        <CoinSparkline
                            :points="coin.sparkline7d"
                            :label="t('marketTable.sparklineLabel', { name: coin.name })"
                        />
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<style lang="scss" scoped>
@use '@/styles/breakpoints' as *;

.market-table {
    position: relative;
    overflow-x: auto;
    border-block-start: 1px solid var(--color-border);

    &__grid {
        inline-size: 100%;
        border-collapse: collapse;
        font-variant-numeric: tabular-nums;
    }

    &__heading {
        padding-block: var(--space-3);
        padding-inline: var(--space-2);
        background: var(--color-bg);
        box-shadow: inset 0 -1px 0 var(--color-border);
        color: var(--color-text);
        font-size: var(--font-size-xs);
        font-weight: 700;
        text-align: start;
        white-space: nowrap;

        abbr {
            text-decoration: none;
        }

        &--numeric {
            text-align: end;
        }

        &--name {
            position: sticky;
            inset-inline-start: 0;
            z-index: 1;
        }

        &--rank {
            display: none;

            @include from(md) {
                display: table-cell;
            }
        }
    }

    &__cell {
        padding-block: var(--space-3);
        padding-inline: var(--space-2);
        background: var(--color-bg);
        box-shadow: inset 0 -1px 0 var(--color-border);
        font-weight: 600;
        white-space: nowrap;
        transition: background-color var(--transition-fast);

        &--watch {
            inline-size: 2.5rem;
            padding-inline-end: 0;
        }

        &--rank {
            display: none;
            inline-size: 2.5rem;
            color: var(--color-text-muted);
            font-size: var(--font-size-sm);
            font-weight: 500;

            @include from(md) {
                display: table-cell;
            }
        }

        &--name {
            position: sticky;
            inset-inline-start: 0;
            z-index: 1;
            text-align: start;
        }

        &--numeric {
            text-align: end;
        }

        &--sparkline {
            padding-block: var(--space-2);
        }
    }

    &__row:hover &__cell {
        background: var(--color-surface-hover);
    }

    &__coin {
        display: inline-flex;
        gap: var(--space-2);
        align-items: center;
    }

    &__logo {
        inline-size: 1.5rem;
        block-size: 1.5rem;
        border-radius: var(--radius-full);
    }

    &__coin-text {
        display: flex;
        flex-direction: column;

        @include from(md) {
            flex-direction: row;
            gap: var(--space-2);
            align-items: baseline;
        }
    }

    &__name {
        max-inline-size: 7rem;
        overflow: hidden;
        text-overflow: ellipsis;

        @include from(md) {
            max-inline-size: 9.5rem;
        }
    }

    &__supply {
        display: inline-flex;
        gap: var(--space-1);
        justify-content: flex-end;
    }

    &__supply-symbol {
        max-inline-size: 3.5rem;
        overflow: hidden;
        color: var(--color-text-muted);
        font-weight: 500;
        text-overflow: ellipsis;
        text-transform: uppercase;
    }

    &__symbol {
        color: var(--color-text-muted);
        font-size: var(--font-size-sm);
        font-weight: 500;
        text-transform: uppercase;
    }

    &__value {
        unicode-bidi: isolate;
    }

    &__watch-button {
        display: grid;
        place-items: center;
        padding: var(--space-1);
        background: none;
        border: 0;
        border-radius: var(--radius-sm);
        color: var(--color-text-muted);
        cursor: pointer;

        &:hover {
            color: var(--color-watch);
        }

        &--active {
            color: var(--color-watch);
        }
    }

    &__watch-icon {
        inline-size: 1rem;
        block-size: 1rem;
        fill: none;
        stroke: currentcolor;
        stroke-width: 1.75;
        stroke-linejoin: round;
    }

    &__watch-button--active &__watch-icon {
        fill: currentcolor;
    }
}
</style>
