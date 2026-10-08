import { beforeEach, describe, expect, it, vi } from 'vitest';
import { createPriceChart, type ChartPalette } from '@/features/coin-detail/chart/priceChart';
import { createHourlyCandles } from '../../../fixtures/coinDetails';

const { chartMock, createdSeries } = vi.hoisted(() => {
    const createdSeries: {
        type: string;
        pane: number;
        setData: ReturnType<typeof vi.fn>;
        update: ReturnType<typeof vi.fn>;
    }[] = [];

    function createSeriesMock(type: string, pane = 0) {
        const series = {
            type,
            pane,
            setData: vi.fn(),
            update: vi.fn(),
            applyOptions: vi.fn(),
            createPriceLine: vi.fn(),
            priceScale: () => ({ applyOptions: vi.fn() }),
        };
        createdSeries.push(series);

        return series;
    }

    const chartMock = {
        addSeries: vi.fn((definition: { type: string }, _options: unknown, pane?: number) =>
            createSeriesMock(definition.type, pane),
        ),
        removeSeries: vi.fn(),
        applyOptions: vi.fn(),
        subscribeCrosshairMove: vi.fn(),
        unsubscribeCrosshairMove: vi.fn(),
        remove: vi.fn(),
        panes: () => [{ setHeight: vi.fn() }, { setHeight: vi.fn() }],
        timeScale: () => ({ setVisibleLogicalRange: vi.fn() }),
    };

    return { chartMock, createdSeries };
});

vi.mock('lightweight-charts', () => ({
    createChart: () => chartMock,
    CandlestickSeries: { type: 'Candlestick' },
    AreaSeries: { type: 'Area' },
    HistogramSeries: { type: 'Histogram' },
    LineSeries: { type: 'Line' },
    CrosshairMode: { Normal: 0 },
    LineStyle: { Dashed: 2 },
}));

const palette: ChartPalette = {
    text: '#000000',
    grid: '#eeeeee',
    up: '#00aa00',
    down: '#aa0000',
    accent: '#0000aa',
    guide: '#888888',
    smaShort: '#ffaa00',
    smaLong: '#aa00ff',
};

function createTestChart() {
    return createPriceChart(document.createElement('div'), {
        palette,
        locale: 'en-US',
        formatPrice: String,
        onHoverCandle: vi.fn(),
    });
}

function seriesOfType(type: string) {
    return createdSeries.find((series) => series.type === type)!;
}

describe('createPriceChart', () => {
    beforeEach(() => {
        createdSeries.length = 0;
        vi.clearAllMocks();
    });

    it('creates the RSI pane only while RSI is shown', () => {
        const chart = createTestChart();
        const rsi = createdSeries.find((series) => series.pane === 1);

        expect(rsi).toBeDefined();

        chart.setDisplay({ chartType: 'candles', showSma: true, showRsi: false });
        expect(chartMock.removeSeries).toHaveBeenCalledWith(rsi);
    });

    it('redraws everything for new history and only updates the last bar for live ticks', () => {
        const chart = createTestChart();
        const candles = createHourlyCandles([100, 101, 102]);
        const candleSeries = seriesOfType('Candlestick');

        chart.setCandles(candles, 3);
        expect(candleSeries.setData).toHaveBeenCalledTimes(1);

        chart.setCandles([...candles.slice(0, -1), { ...candles[2]!, close: 105 }], 3);
        expect(candleSeries.setData).toHaveBeenCalledTimes(1);
        expect(candleSeries.update).toHaveBeenCalledWith(expect.objectContaining({ close: 105 }));

        chart.setCandles(
            createHourlyCandles([200, 201]).map((candle) => ({
                ...candle,
                time: candle.time + 999,
            })),
            2,
        );
        expect(candleSeries.setData).toHaveBeenCalledTimes(2);
    });

    it('releases the chart on destroy', () => {
        createTestChart().destroy();

        expect(chartMock.unsubscribeCrosshairMove).toHaveBeenCalled();
        expect(chartMock.remove).toHaveBeenCalled();
    });
});
