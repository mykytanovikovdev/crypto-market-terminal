import { flushPromises } from '@vue/test-utils';
import { beforeEach, describe, expect, it } from 'vitest';
import { nextTick } from 'vue';
import { useChartSettings } from '@/features/coin-detail/useChartSettings';
import { STORAGE_KEYS } from '@/utils/storage';
import { withSetup } from '../../../helpers/withSetup';

describe('useChartSettings', () => {
    beforeEach(() => {
        localStorage.clear();
    });

    it('defaults to a 7-day candle chart with all indicators', async () => {
        const { result } = await withSetup(useChartSettings, '/coin/bitcoin?range=10Y');

        expect(result.timeframe.value).toBe('7D');
        expect(result.chartType.value).toBe('candles');
        expect(result.showSma.value).toBe(true);
        expect(result.showRsi.value).toBe(true);
    });

    it('keeps the period in the URL so the view can be shared', async () => {
        const { result, router } = await withSetup(useChartSettings, '/coin/bitcoin?range=1M');

        expect(result.timeframe.value).toBe('1M');

        result.timeframe.value = '7D';
        await flushPromises();

        expect(router.currentRoute.value.query).toEqual({});
    });

    it('remembers chart type and indicators across coins', async () => {
        const first = await withSetup(useChartSettings, '/coin/bitcoin');

        first.result.chartType.value = 'line';
        first.result.showRsi.value = false;
        await nextTick();

        expect(JSON.parse(localStorage.getItem(STORAGE_KEYS.chartSettings) ?? '{}')).toEqual({
            chartType: 'line',
            showSma: true,
            showRsi: false,
        });

        const second = await withSetup(useChartSettings, '/coin/ethereum');

        expect(second.result.chartType.value).toBe('line');
        expect(second.result.showRsi.value).toBe(false);
    });

    it('ignores corrupted saved settings', async () => {
        localStorage.setItem(STORAGE_KEYS.chartSettings, '{oops');

        const { result } = await withSetup(useChartSettings, '/coin/bitcoin');

        expect(result.chartType.value).toBe('candles');
    });
});
