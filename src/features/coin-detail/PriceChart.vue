<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, useTemplateRef, watch } from 'vue';
import { I18nT, useI18n } from 'vue-i18n';
import { useLocale } from '@/composables/useLocale';
import { useTheme } from '@/composables/useTheme';
import {
    createPriceChart,
    readChartPalette,
    type ChartDisplay,
    type PriceChart,
} from '@/features/coin-detail/chart/priceChart';
import type { CandleSeries } from '@/features/coin-detail/loadCoinCandles';
import type { Candle } from '@/types/market';
import { formatCompactNumber, formatPrice } from '@/utils/format';

const props = defineProps<{
    series: CandleSeries | null;
    display: ChartDisplay;
    visibleCandles: number;
    isLoading: boolean;
    errorMessage: string | null;
    coinName: string;
    symbol: string;
}>();

const emit = defineEmits<{
    retry: [];
}>();

const TRADINGVIEW_URL = 'https://www.tradingview.com/';

const { t } = useI18n();
const { numberLocale } = useLocale();
const { currentTheme } = useTheme();
const container = useTemplateRef<HTMLDivElement>('chartContainer');
const hoveredCandle = ref<Candle | null>(null);
let chart: PriceChart | null = null;

const legendCandle = computed(() => hoveredCandle.value ?? props.series?.candles.at(-1) ?? null);

const sourceNote = computed(() => {
    if (!props.series) {
        return null;
    }

    const interval = t(`chart.intervals.${props.series.intervalMs}`);

    return props.series.source === 'binance'
        ? t('chart.sourceBinance', { pair: props.series.pair, interval })
        : t('chart.sourceCoinGecko', { interval });
});

function formatChartPrice(value: number): string {
    return formatPrice(value, numberLocale.value);
}

function setHoveredCandle(candle: Candle | null): void {
    hoveredCandle.value = candle;
}

function renderCandles(): void {
    if (props.series) {
        chart?.setCandles(props.series.candles, props.visibleCandles);
    }
}

function applyDisplay(display: ChartDisplay): void {
    chart?.setDisplay(display);
}

function applyTheme(): void {
    chart?.setPalette(readChartPalette());
}

function applyLocale(locale: string): void {
    chart?.setLocale(locale, formatChartPrice);
}

function handleRetryClick(): void {
    emit('retry');
}

onMounted(() => {
    if (!container.value) {
        return;
    }

    chart = createPriceChart(container.value, {
        palette: readChartPalette(),
        locale: numberLocale.value,
        formatPrice: formatChartPrice,
        onHoverCandle: setHoveredCandle,
    });
    applyDisplay(props.display);
    renderCandles();
});

onBeforeUnmount(() => chart?.destroy());

watch(() => props.series?.candles, renderCandles);
watch(() => props.display, applyDisplay, { deep: true });
watch(currentTheme, applyTheme);
watch(numberLocale, applyLocale);
</script>

<template>
    <div class="price-chart">
        <dl v-if="legendCandle" class="price-chart__legend">
            <div class="price-chart__legend-item">
                <dt>{{ t('chart.open') }}</dt>
                <dd>{{ formatChartPrice(legendCandle.open) }}</dd>
            </div>
            <div class="price-chart__legend-item">
                <dt>{{ t('chart.high') }}</dt>
                <dd>{{ formatChartPrice(legendCandle.high) }}</dd>
            </div>
            <div class="price-chart__legend-item">
                <dt>{{ t('chart.low') }}</dt>
                <dd>{{ formatChartPrice(legendCandle.low) }}</dd>
            </div>
            <div class="price-chart__legend-item">
                <dt>{{ t('chart.close') }}</dt>
                <dd>{{ formatChartPrice(legendCandle.close) }}</dd>
            </div>
            <div v-if="legendCandle.volume !== null" class="price-chart__legend-item">
                <dt>{{ t('chart.volume') }}</dt>
                <dd>{{ formatCompactNumber(legendCandle.volume, numberLocale) }} {{ symbol }}</dd>
            </div>
        </dl>

        <div class="price-chart__frame" dir="ltr">
            <div
                ref="chartContainer"
                class="price-chart__canvas"
                role="img"
                :aria-label="t('chart.accessibleSummary', { name: coinName })"
            />

            <div v-if="isLoading" class="price-chart__overlay" role="status">
                <span class="price-chart__spinner" aria-hidden="true" />
                {{ t('chart.loading') }}
            </div>

            <div v-else-if="errorMessage" class="price-chart__overlay" role="alert">
                <p>{{ t('chart.error') }} {{ errorMessage }}</p>
                <button type="button" class="price-chart__retry" @click="handleRetryClick">
                    {{ t('chart.retry') }}
                </button>
            </div>
        </div>

        <p class="price-chart__note">
            <span v-if="sourceNote">{{ sourceNote }}</span>
            <I18nT keypath="chart.attribution" tag="span" scope="global">
                <template #link>
                    <a :href="TRADINGVIEW_URL" target="_blank" rel="noopener noreferrer">
                        TradingView
                    </a>
                </template>
            </I18nT>
        </p>
    </div>
</template>

<style lang="scss" scoped>
@use '@/styles/breakpoints' as *;

.price-chart {
    &__legend {
        display: flex;
        flex-wrap: wrap;
        gap: var(--space-1) var(--space-4);
        min-block-size: 1.25rem;
        margin: 0 0 var(--space-2);
        color: var(--color-text-muted);
        font-size: var(--font-size-xs);
    }

    &__legend-item {
        display: flex;
        gap: var(--space-1);

        dd {
            margin: 0;
            color: var(--color-text);
            font-weight: 600;
            unicode-bidi: isolate;
        }
    }

    &__frame {
        position: relative;
        border-block: 1px solid var(--color-border);
    }

    &__canvas {
        block-size: 20rem;

        @include from(md) {
            block-size: 28rem;
        }
    }

    &__overlay {
        position: absolute;
        inset: 0;
        display: flex;
        flex-direction: column;
        gap: var(--space-3);
        align-items: center;
        justify-content: center;
        background: var(--color-bg);
        color: var(--color-text-muted);
        text-align: center;
    }

    &__spinner {
        inline-size: 1.25rem;
        block-size: 1.25rem;
        border: 2px solid var(--color-border);
        border-block-start-color: var(--color-accent);
        border-radius: var(--radius-full);
        animation: price-chart-spin 0.8s linear infinite;
    }

    &__retry {
        padding-block: var(--space-2);
        padding-inline: var(--space-4);
        background: var(--color-accent);
        border: 0;
        border-radius: var(--radius-sm);
        color: var(--color-on-accent);
        font-weight: 600;
        cursor: pointer;
    }

    &__note {
        display: flex;
        flex-wrap: wrap;
        gap: var(--space-1);
        margin-block-start: var(--space-2);
        color: var(--color-text-muted);
        font-size: var(--font-size-xs);
    }
}

@keyframes price-chart-spin {
    to {
        transform: rotate(360deg);
    }
}
</style>
