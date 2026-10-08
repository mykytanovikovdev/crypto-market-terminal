<script setup lang="ts">
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import SegmentedControl, { type SegmentedOption } from '@/components/SegmentedControl.vue';
import type { ChartType } from '@/features/coin-detail/chart/priceChart';
import { CHART_TIMEFRAMES, type ChartTimeframe } from '@/features/coin-detail/chartTimeframes';

const timeframe = defineModel<ChartTimeframe>('timeframe', { required: true });
const chartType = defineModel<ChartType>('chartType', { required: true });
const showSma = defineModel<boolean>('showSma', { required: true });
const showRsi = defineModel<boolean>('showRsi', { required: true });

const { t } = useI18n();

const timeframeOptions = computed<SegmentedOption<ChartTimeframe>[]>(() =>
    CHART_TIMEFRAMES.map((value) => ({ value, label: t(`chart.timeframes.${value}`) })),
);

const chartTypeOptions = computed<SegmentedOption<ChartType>[]>(() => [
    { value: 'candles', label: t('chart.candles') },
    { value: 'line', label: t('chart.line') },
]);

function toggleSma(): void {
    showSma.value = !showSma.value;
}

function toggleRsi(): void {
    showRsi.value = !showRsi.value;
}
</script>

<template>
    <div class="chart-toolbar">
        <div class="chart-toolbar__group">
            <SegmentedControl
                v-model="timeframe"
                :options="timeframeOptions"
                :label="t('chart.timeframeLabel')"
            />
            <SegmentedControl
                v-model="chartType"
                :options="chartTypeOptions"
                :label="t('chart.chartTypeLabel')"
            />
        </div>

        <div class="chart-toolbar__group" role="group" :aria-label="t('chart.indicatorsLabel')">
            <button
                type="button"
                class="chart-toolbar__toggle"
                :class="{ 'chart-toolbar__toggle--active': showSma }"
                :aria-pressed="showSma"
                @click="toggleSma"
            >
                <span class="chart-toolbar__swatch chart-toolbar__swatch--sma" aria-hidden="true" />
                {{ t('chart.sma') }}
            </button>
            <button
                type="button"
                class="chart-toolbar__toggle"
                :class="{ 'chart-toolbar__toggle--active': showRsi }"
                :aria-pressed="showRsi"
                @click="toggleRsi"
            >
                <span class="chart-toolbar__swatch chart-toolbar__swatch--rsi" aria-hidden="true" />
                {{ t('chart.rsi') }}
            </button>
        </div>
    </div>
</template>

<style lang="scss" scoped>
.chart-toolbar {
    display: flex;
    flex-wrap: wrap;
    gap: var(--space-3);
    align-items: center;
    justify-content: space-between;
    margin-block-end: var(--space-3);

    &__group {
        display: flex;
        flex-wrap: wrap;
        gap: var(--space-2);
    }

    &__toggle {
        display: inline-flex;
        gap: var(--space-2);
        align-items: center;
        padding-block: 0.3125rem;
        padding-inline: var(--space-3);
        background: var(--color-bg);
        border: 1px solid var(--color-border);
        border-radius: var(--radius-sm);
        color: var(--color-text-muted);
        font-size: var(--font-size-sm);
        font-weight: 600;
        cursor: pointer;
        transition:
            color var(--transition-fast),
            border-color var(--transition-fast);

        &:hover {
            color: var(--color-text);
        }

        &--active {
            background: var(--color-accent-soft);
            border-color: var(--color-accent);
            color: var(--color-text);
        }
    }

    &__swatch {
        inline-size: 0.875rem;
        block-size: 0.1875rem;
        border-radius: var(--radius-full);

        &--sma {
            background: linear-gradient(
                90deg,
                var(--color-chart-sma-short) 50%,
                var(--color-chart-sma-long) 50%
            );
        }

        &--rsi {
            background: var(--color-accent);
        }
    }
}
</style>
