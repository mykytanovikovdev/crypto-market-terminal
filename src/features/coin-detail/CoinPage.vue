<script setup lang="ts">
import { computed, watch, watchEffect } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRoute } from 'vue-router';
import { fetchCoinDetails } from '@/api/coingecko';
import RequestState from '@/components/RequestState.vue';
import { useApiErrorMessage } from '@/composables/useApiErrorMessage';
import { useAsyncResource } from '@/composables/useAsyncResource';
import { useLiveCoins } from '@/composables/useLiveCoins';
import { useLocale } from '@/composables/useLocale';
import PriceAlertControl from '@/features/alerts/PriceAlertControl.vue';
import ChartToolbar from '@/features/coin-detail/ChartToolbar.vue';
import { TIMEFRAME_SETTINGS } from '@/features/coin-detail/chartTimeframes';
import CoinAbout from '@/features/coin-detail/CoinAbout.vue';
import CoinConverter from '@/features/coin-detail/CoinConverter.vue';
import CoinHeader from '@/features/coin-detail/CoinHeader.vue';
import CoinLinks from '@/features/coin-detail/CoinLinks.vue';
import CoinPerformance from '@/features/coin-detail/CoinPerformance.vue';
import CoinStats from '@/features/coin-detail/CoinStats.vue';
import PriceChart from '@/features/coin-detail/PriceChart.vue';
import { useChartSettings } from '@/features/coin-detail/useChartSettings';
import { useCoinCandles } from '@/features/coin-detail/useCoinCandles';
import { useLiveTickerStore } from '@/stores/liveTicker';
import { useMarketStore } from '@/stores/market';
import type { CoinDetails } from '@/types/coin';
import { formatPrice } from '@/utils/format';

const HTTP_NOT_FOUND = 404;

const { t } = useI18n();
const route = useRoute();
const { numberLocale } = useLocale();
const marketStore = useMarketStore();
const liveTicker = useLiveTickerStore();

const coinId = computed(() => String(route.params.id));
const {
    data: coinDetails,
    isLoading: isDetailsLoading,
    error: detailsError,
    load: loadDetails,
} = useAsyncResource(fetchCoinDetails, null as CoinDetails | null);
const detailsErrorMessage = useApiErrorMessage(detailsError);
const isNotFound = computed(() => detailsError.value?.status === HTTP_NOT_FOUND);

const trackedCoins = computed(() => (coinDetails.value ? [coinDetails.value] : []));
const liveCoins = useLiveCoins(trackedCoins);
const coin = computed(() => liveCoins.value[0] ?? null);
const livePrice = computed(() => liveTicker.quotes[coinId.value]?.price ?? null);

const { timeframe, chartType, showSma, showRsi } = useChartSettings();
const chartDisplay = computed(() => ({
    chartType: chartType.value,
    showSma: showSma.value,
    showRsi: showRsi.value,
}));
const visibleCandles = computed(() => TIMEFRAME_SETTINGS[timeframe.value].visibleCandles);
const {
    series: candleSeries,
    isLoading: isChartLoading,
    error: chartError,
    reload: reloadChart,
} = useCoinCandles(coinDetails, timeframe, livePrice);
const chartErrorMessage = useApiErrorMessage(chartError);

function reloadDetails(): void {
    void loadDetails(coinId.value);
}

function toggleWatch(): void {
    marketStore.toggleWatch(coinId.value);
}

function updateDocumentTitle(): void {
    if (coin.value) {
        document.title = t('coin.pageTitle', {
            symbol: coin.value.symbol.toUpperCase(),
            price: formatPrice(coin.value.price, numberLocale.value),
        });
    }
}

watch(coinId, reloadDetails, { immediate: true });
watchEffect(updateDocumentTitle);
</script>

<template>
    <div class="coin-page">
        <RouterLink class="coin-page__back" :to="{ name: 'markets' }">
            <svg class="coin-page__back-icon" viewBox="0 0 16 16" aria-hidden="true">
                <path d="M10 3 5 8l5 5" />
            </svg>
            {{ t('coin.back') }}
        </RouterLink>

        <div v-if="isNotFound" class="coin-page__not-found">
            <h1 class="coin-page__not-found-title">{{ t('coin.notFoundTitle') }}</h1>
            <p>{{ t('coin.notFoundText') }}</p>
            <RouterLink :to="{ name: 'markets' }">{{ t('coin.notFoundAction') }}</RouterLink>
        </div>

        <RequestState
            v-else
            :is-loading="isDetailsLoading && coin?.id !== coinId"
            :error-message="detailsErrorMessage"
            :is-empty="false"
            @retry="reloadDetails"
        >
            <div v-if="coin" class="coin-page__layout">
                <div class="coin-page__main">
                    <CoinHeader
                        class="coin-page__header"
                        :coin="coin"
                        :is-watched="marketStore.isWatched(coin.id)"
                        @toggle-watch="toggleWatch"
                    >
                        <template #actions>
                            <PriceAlertControl
                                :coin="coin"
                                :current-price="coin.price"
                                :has-live-price="livePrice !== null"
                            />
                        </template>
                    </CoinHeader>

                    <section class="coin-page__chart">
                        <ChartToolbar
                            v-model:timeframe="timeframe"
                            v-model:chart-type="chartType"
                            v-model:show-sma="showSma"
                            v-model:show-rsi="showRsi"
                        />
                        <PriceChart
                            :series="candleSeries"
                            :display="chartDisplay"
                            :visible-candles="visibleCandles"
                            :is-loading="isChartLoading"
                            :error-message="chartErrorMessage"
                            :coin-name="coin.name"
                            :symbol="coin.symbol.toUpperCase()"
                            @retry="reloadChart"
                        />
                    </section>

                    <CoinPerformance class="coin-page__performance" :coin="coin" />
                    <CoinAbout
                        class="coin-page__about"
                        :name="coin.name"
                        :paragraphs="coin.descriptionParagraphs"
                    />
                </div>

                <div class="coin-page__side">
                    <CoinStats class="coin-page__stats" :coin="coin" />
                    <CoinConverter
                        class="coin-page__converter"
                        :symbol="coin.symbol"
                        :price="coin.price"
                    />
                    <CoinLinks class="coin-page__links" :links="coin.links" />
                </div>
            </div>
        </RequestState>
    </div>
</template>

<style lang="scss" scoped>
@use '@/styles/breakpoints' as *;

.coin-page {
    &__back {
        display: inline-flex;
        gap: var(--space-1);
        align-items: center;
        margin-block-end: var(--space-4);
        color: var(--color-text-muted);
        font-size: var(--font-size-sm);
        font-weight: 600;
        text-decoration: none;

        &:hover {
            color: var(--color-text);
        }
    }

    &__back-icon {
        inline-size: 1rem;
        block-size: 1rem;
        fill: none;
        stroke: currentcolor;
        stroke-width: 2;
        stroke-linecap: round;
        stroke-linejoin: round;

        [dir='rtl'] & {
            transform: scaleX(-1);
        }
    }

    &__layout {
        display: flex;
        flex-direction: column;
        gap: var(--space-6);

        @include from(lg) {
            display: grid;
            grid-template-columns: minmax(0, 1fr) 22rem;
            gap: var(--space-8);
            align-items: start;
        }
    }

    &__main,
    &__side {
        display: contents;

        @include from(lg) {
            display: flex;
            flex-direction: column;
        }
    }

    &__main {
        @include from(lg) {
            gap: var(--space-8);
        }
    }

    &__side {
        @include from(lg) {
            position: sticky;
            inset-block-start: calc(var(--header-height) + var(--space-4));
            padding-inline: var(--space-4);
            border: 1px solid var(--color-border);
            border-radius: var(--radius-md);
        }
    }

    &__header {
        order: 1;
    }

    &__chart {
        order: 2;
    }

    &__stats {
        order: 3;
    }

    &__performance {
        order: 4;
    }

    &__converter {
        order: 5;
        border-block-start: 1px solid var(--color-border);
    }

    &__about {
        order: 6;
    }

    &__links {
        order: 7;
        border-block-start: 1px solid var(--color-border);
    }

    &__not-found {
        display: grid;
        gap: var(--space-3);
        justify-items: start;
        padding-block: var(--space-12);
        color: var(--color-text-muted);
    }

    &__not-found-title {
        color: var(--color-text);
        font-size: var(--font-size-xl);
    }
}
</style>
