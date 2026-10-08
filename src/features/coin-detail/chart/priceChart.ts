import {
    AreaSeries,
    CandlestickSeries,
    createChart,
    CrosshairMode,
    HistogramSeries,
    LineSeries,
    LineStyle,
    type IChartApi,
    type ISeriesApi,
    type MouseEventParams,
    type UTCTimestamp,
} from 'lightweight-charts';
import {
    RSI_PERIOD,
    SMA_LONG_PERIOD,
    SMA_SHORT_PERIOD,
    toCandlestickData,
    toCloseLineData,
    toIndicatorLineData,
    toVolumeData,
} from '@/features/coin-detail/chart/chartSeries';
import type { Candle } from '@/types/market';
import { withAlpha } from '@/utils/color';
import { calculateRsi, calculateSma } from '@/utils/indicators';

const RSI_PANE_HEIGHT = 96;
const RSI_LEVELS = [70, 30];
const VOLUME_ALPHA = 0.35;
const AREA_TOP_ALPHA = 0.2;

export type ChartType = 'candles' | 'line';

export interface ChartPalette {
    text: string;
    grid: string;
    up: string;
    down: string;
    accent: string;
    guide: string;
    smaShort: string;
    smaLong: string;
}

export interface ChartDisplay {
    chartType: ChartType;
    showSma: boolean;
    showRsi: boolean;
}

export interface PriceChartOptions {
    palette: ChartPalette;
    locale: string;
    formatPrice: (value: number) => string;
    onHoverCandle: (candle: Candle | null) => void;
}

export interface PriceChart {
    setCandles: (candles: Candle[], visibleCandles: number) => void;
    setDisplay: (display: ChartDisplay) => void;
    setPalette: (palette: ChartPalette) => void;
    setLocale: (locale: string, formatPrice: (value: number) => string) => void;
    destroy: () => void;
}

export function readChartPalette(): ChartPalette {
    const styles = getComputedStyle(document.documentElement);
    const token = (name: string) => styles.getPropertyValue(name).trim();

    return {
        text: token('--color-text-muted'),
        grid: token('--color-border'),
        up: token('--color-up'),
        down: token('--color-down'),
        accent: token('--color-accent'),
        guide: token('--color-icon-subtle'),
        smaShort: token('--color-chart-sma-short'),
        smaLong: token('--color-chart-sma-long'),
    };
}

function isSameHistory(previous: Candle[], next: Candle[]): boolean {
    const sameStart = previous[0]?.time === next[0]?.time;
    const lengthDelta = next.length - previous.length;

    return previous.length > 0 && sameStart && (lengthDelta === 0 || lengthDelta === 1);
}

export function createPriceChart(container: HTMLElement, options: PriceChartOptions): PriceChart {
    let palette = options.palette;
    let formatPrice = options.formatPrice;
    let candles: Candle[] = [];
    let display: ChartDisplay = { chartType: 'candles', showSma: true, showRsi: true };
    let rsiSeries: ISeriesApi<'Line'> | null = null;

    const chart: IChartApi = createChart(container, {
        autoSize: true,
        layout: {
            background: { color: 'transparent' },
            textColor: palette.text,
            fontFamily: 'Inter, system-ui, sans-serif',
            fontSize: 11,
            attributionLogo: false,
            panes: { separatorColor: palette.grid, enableResize: false },
        },
        grid: { vertLines: { color: palette.grid }, horzLines: { color: palette.grid } },
        rightPriceScale: { borderVisible: false },
        timeScale: { borderVisible: false, timeVisible: true, secondsVisible: false },
        crosshair: { mode: CrosshairMode.Normal },
        localization: { locale: options.locale },
    });

    const priceFormat = () =>
        ({ type: 'custom', formatter: formatPrice, minMove: 0.00000001 }) as const;

    const candleSeries = chart.addSeries(CandlestickSeries, {
        borderVisible: false,
        priceFormat: priceFormat(),
    });
    const areaSeries = chart.addSeries(AreaSeries, {
        lineWidth: 2,
        visible: false,
        priceFormat: priceFormat(),
    });
    const volumeSeries = chart.addSeries(HistogramSeries, {
        priceScaleId: 'volume',
        priceFormat: { type: 'volume' },
        lastValueVisible: false,
        priceLineVisible: false,
    });
    volumeSeries.priceScale().applyOptions({ scaleMargins: { top: 0.82, bottom: 0 } });

    const indicatorLineOptions = {
        lineWidth: 2,
        lastValueVisible: false,
        priceLineVisible: false,
        crosshairMarkerVisible: false,
    } as const;
    const smaShortSeries = chart.addSeries(LineSeries, indicatorLineOptions);
    const smaLongSeries = chart.addSeries(LineSeries, indicatorLineOptions);

    function applyPalette(): void {
        chart.applyOptions({
            layout: { textColor: palette.text, panes: { separatorColor: palette.grid } },
            grid: { vertLines: { color: palette.grid }, horzLines: { color: palette.grid } },
        });
        candleSeries.applyOptions({
            upColor: palette.up,
            downColor: palette.down,
            wickUpColor: palette.up,
            wickDownColor: palette.down,
        });
        areaSeries.applyOptions({
            lineColor: palette.accent,
            topColor: withAlpha(palette.accent, AREA_TOP_ALPHA),
            bottomColor: withAlpha(palette.accent, 0),
        });
        smaShortSeries.applyOptions({ color: palette.smaShort });
        smaLongSeries.applyOptions({ color: palette.smaLong });
        rsiSeries?.applyOptions({ color: palette.accent });
    }

    function volumeColors(): [string, string] {
        return [withAlpha(palette.up, VOLUME_ALPHA), withAlpha(palette.down, VOLUME_ALPHA)];
    }

    function renderIndicators(): void {
        const closes = candles.map((candle) => candle.close);

        smaShortSeries.setData(
            toIndicatorLineData(candles, calculateSma(closes, SMA_SHORT_PERIOD)),
        );
        smaLongSeries.setData(toIndicatorLineData(candles, calculateSma(closes, SMA_LONG_PERIOD)));
        rsiSeries?.setData(toIndicatorLineData(candles, calculateRsi(closes, RSI_PERIOD)));
    }

    function renderAll(): void {
        const [upVolume, downVolume] = volumeColors();

        candleSeries.setData(candles.map(toCandlestickData));
        areaSeries.setData(candles.map(toCloseLineData));
        volumeSeries.setData(candles.map((candle) => toVolumeData(candle, upVolume, downVolume)));
        renderIndicators();
    }

    function renderLastCandle(): void {
        const lastCandle = candles.at(-1);

        if (!lastCandle) {
            return;
        }

        const [upVolume, downVolume] = volumeColors();

        candleSeries.update(toCandlestickData(lastCandle));
        areaSeries.update(toCloseLineData(lastCandle));
        volumeSeries.update(toVolumeData(lastCandle, upVolume, downVolume));
        renderIndicators();
    }

    function createRsiSeries(): void {
        rsiSeries = chart.addSeries(
            LineSeries,
            {
                color: palette.accent,
                lineWidth: 2,
                priceLineVisible: false,
                priceFormat: { type: 'custom', formatter: (value: number) => value.toFixed(0) },
            },
            1,
        );

        for (const level of RSI_LEVELS) {
            rsiSeries.createPriceLine({
                price: level,
                color: palette.guide,
                lineWidth: 1,
                lineStyle: LineStyle.Dashed,
                axisLabelVisible: false,
            });
        }

        chart.panes()[1]?.setHeight(RSI_PANE_HEIGHT);
    }

    function removeRsiSeries(): void {
        if (rsiSeries) {
            chart.removeSeries(rsiSeries);
            rsiSeries = null;
        }
    }

    function handleCrosshairMove(event: MouseEventParams): void {
        const hoveredTime = event.time as UTCTimestamp | undefined;

        options.onHoverCandle(
            hoveredTime === undefined
                ? null
                : (candles.find((candle) => candle.time === hoveredTime) ?? null),
        );
    }

    function setCandles(nextCandles: Candle[], visibleCandles: number): void {
        const canUpdateInPlace = isSameHistory(candles, nextCandles);

        candles = nextCandles;

        if (canUpdateInPlace) {
            renderLastCandle();

            return;
        }

        renderAll();
        chart.timeScale().setVisibleLogicalRange({
            from: Math.max(candles.length - visibleCandles, 0),
            to: candles.length + 2,
        });
    }

    function setDisplay(nextDisplay: ChartDisplay): void {
        display = nextDisplay;
        candleSeries.applyOptions({ visible: display.chartType === 'candles' });
        areaSeries.applyOptions({ visible: display.chartType === 'line' });
        smaShortSeries.applyOptions({ visible: display.showSma });
        smaLongSeries.applyOptions({ visible: display.showSma });

        if (display.showRsi && !rsiSeries) {
            createRsiSeries();
            renderIndicators();
        } else if (!display.showRsi) {
            removeRsiSeries();
        }
    }

    function setPalette(nextPalette: ChartPalette): void {
        palette = nextPalette;
        applyPalette();
        renderAll();
    }

    function setLocale(locale: string, nextFormatPrice: (value: number) => string): void {
        formatPrice = nextFormatPrice;
        chart.applyOptions({ localization: { locale } });
        candleSeries.applyOptions({ priceFormat: priceFormat() });
        areaSeries.applyOptions({ priceFormat: priceFormat() });
    }

    function destroy(): void {
        chart.unsubscribeCrosshairMove(handleCrosshairMove);
        chart.remove();
    }

    applyPalette();
    setDisplay(display);
    chart.subscribeCrosshairMove(handleCrosshairMove);

    return { setCandles, setDisplay, setPalette, setLocale, destroy };
}
