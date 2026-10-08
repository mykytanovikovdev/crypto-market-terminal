import type { BinanceInterval } from '@/api/binance';

export const CHART_TIMEFRAMES = ['1D', '7D', '1M', '3M', '1Y'] as const;

export type ChartTimeframe = (typeof CHART_TIMEFRAMES)[number];

export const DEFAULT_TIMEFRAME: ChartTimeframe = '7D';

export const INDICATOR_WARMUP_CANDLES = 50;

const MINUTE_MS = 60_000;
const HOUR_MS = 60 * MINUTE_MS;
const DAY_MS = 24 * HOUR_MS;

export interface TimeframeSettings {
    visibleCandles: number;
    binanceInterval: BinanceInterval;
    binanceIntervalMs: number;
    coinGeckoDays: number;
    coinGeckoIntervalMs: number;
}

export const TIMEFRAME_SETTINGS: Record<ChartTimeframe, TimeframeSettings> = {
    '1D': {
        visibleCandles: 96,
        binanceInterval: '15m',
        binanceIntervalMs: 15 * MINUTE_MS,
        coinGeckoDays: 1,
        coinGeckoIntervalMs: 30 * MINUTE_MS,
    },
    '7D': {
        visibleCandles: 168,
        binanceInterval: '1h',
        binanceIntervalMs: HOUR_MS,
        coinGeckoDays: 7,
        coinGeckoIntervalMs: 4 * HOUR_MS,
    },
    '1M': {
        visibleCandles: 180,
        binanceInterval: '4h',
        binanceIntervalMs: 4 * HOUR_MS,
        coinGeckoDays: 30,
        coinGeckoIntervalMs: 4 * HOUR_MS,
    },
    '3M': {
        visibleCandles: 180,
        binanceInterval: '12h',
        binanceIntervalMs: 12 * HOUR_MS,
        coinGeckoDays: 90,
        coinGeckoIntervalMs: 4 * DAY_MS,
    },
    '1Y': {
        visibleCandles: 365,
        binanceInterval: '1d',
        binanceIntervalMs: DAY_MS,
        coinGeckoDays: 365,
        coinGeckoIntervalMs: 4 * DAY_MS,
    },
};

export function isChartTimeframe(value: string | null): value is ChartTimeframe {
    return CHART_TIMEFRAMES.some((timeframe) => timeframe === value);
}
