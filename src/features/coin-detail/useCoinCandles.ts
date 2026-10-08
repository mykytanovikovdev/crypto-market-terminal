import { computed, watch, type Ref } from 'vue';
import { useAsyncResource } from '@/composables/useAsyncResource';
import type { ChartTimeframe } from '@/features/coin-detail/chartTimeframes';
import {
    loadCoinCandles,
    type CandleSeries,
    type ChartCoin,
} from '@/features/coin-detail/loadCoinCandles';
import { applyLivePriceToCandles } from '@/utils/candles';

export function useCoinCandles(
    coin: Ref<ChartCoin | null>,
    timeframe: Ref<ChartTimeframe>,
    livePrice: Ref<number | null>,
) {
    const series = useAsyncResource(loadCoinCandles, null as CandleSeries | null);

    function reload(): void {
        if (coin.value) {
            void series.load(coin.value, timeframe.value);
        }
    }

    const liveSeries = computed<CandleSeries | null>(() => {
        const loadedSeries = series.data.value;

        if (!loadedSeries || loadedSeries.source !== 'binance' || livePrice.value === null) {
            return loadedSeries;
        }

        return {
            ...loadedSeries,
            candles: applyLivePriceToCandles(
                loadedSeries.candles,
                livePrice.value,
                Date.now(),
                loadedSeries.intervalMs,
            ),
        };
    });

    watch([() => coin.value?.id, timeframe], reload, { immediate: true });

    return { series: liveSeries, isLoading: series.isLoading, error: series.error, reload };
}
