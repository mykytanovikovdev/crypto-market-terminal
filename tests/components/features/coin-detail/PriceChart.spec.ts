import { mount } from '@vue/test-utils';
import { describe, expect, it, vi } from 'vitest';
import PriceChart from '@/features/coin-detail/PriceChart.vue';
import type { CandleSeries } from '@/features/coin-detail/loadCoinCandles';
import { createHourlyCandles } from '../../../fixtures/coinDetails';
import { createTestPlugins } from '../../../helpers/plugins';

const chartApi = vi.hoisted(() => ({
    setCandles: vi.fn(),
    setDisplay: vi.fn(),
    setPalette: vi.fn(),
    setLocale: vi.fn(),
    destroy: vi.fn(),
}));

vi.mock('@/features/coin-detail/chart/priceChart', () => ({
    createPriceChart: () => chartApi,
    readChartPalette: () => ({}),
}));

const binanceSeries: CandleSeries = {
    candles: createHourlyCandles([100, 110]),
    source: 'binance',
    pair: 'BTCUSDT',
    intervalMs: 3_600_000,
};

function mountChart(props: Partial<InstanceType<typeof PriceChart>['$props']> = {}) {
    return mount(PriceChart, {
        props: {
            series: binanceSeries,
            display: { chartType: 'candles', showSma: true, showRsi: true },
            visibleCandles: 168,
            isLoading: false,
            errorMessage: null,
            coinName: 'Bitcoin',
            symbol: 'BTC',
            ...props,
        },
        global: { plugins: createTestPlugins() },
    });
}

describe('PriceChart', () => {
    it('passes candles to the chart and shows the latest candle in the legend', () => {
        const wrapper = mountChart();

        expect(chartApi.setCandles).toHaveBeenCalledWith(binanceSeries.candles, 168);
        expect(wrapper.find('.price-chart__legend').text()).toContain('Close$110.00');
        expect(wrapper.find('.price-chart__legend').text()).toContain('Volume101 BTC');
    });

    it('names the data source and links to TradingView', () => {
        const note = mountChart().find('.price-chart__note');

        expect(note.text()).toContain('Candles from Binance BTCUSDT, 1 hour.');
        expect(note.find('a').attributes('href')).toBe('https://www.tradingview.com/');
    });

    it('explains the CoinGecko fallback and hides volume', () => {
        const wrapper = mountChart({
            series: {
                candles: createHourlyCandles([100], false),
                source: 'coingecko',
                pair: null,
                intervalMs: 345_600_000,
            },
        });

        expect(wrapper.find('.price-chart__note').text()).toContain(
            'Candles from CoinGecko, 4 days. Volume is not available for this coin.',
        );
        expect(wrapper.find('.price-chart__legend').text()).not.toContain('Volume');
    });

    it('shows an error with a retry action', async () => {
        const wrapper = mountChart({ isLoading: false, errorMessage: 'Network down.' });

        await wrapper.find('.price-chart__retry').trigger('click');

        expect(wrapper.find('[role="alert"]').text()).toContain('Could not load the chart.');
        expect(wrapper.emitted('retry')).toHaveLength(1);
    });

    it('destroys the chart when unmounted', () => {
        mountChart().unmount();

        expect(chartApi.destroy).toHaveBeenCalled();
    });
});
