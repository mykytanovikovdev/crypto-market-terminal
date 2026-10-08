import type {
    CandlestickData,
    HistogramData,
    LineData,
    UTCTimestamp,
    WhitespaceData,
} from 'lightweight-charts';
import type { Candle } from '@/types/market';

export const SMA_SHORT_PERIOD = 20;
export const SMA_LONG_PERIOD = 50;
export const RSI_PERIOD = 14;

function toTimestamp(seconds: number): UTCTimestamp {
    return seconds as UTCTimestamp;
}

export function toCandlestickData(candle: Candle): CandlestickData<UTCTimestamp> {
    return {
        time: toTimestamp(candle.time),
        open: candle.open,
        high: candle.high,
        low: candle.low,
        close: candle.close,
    };
}

export function toCloseLineData(candle: Candle): LineData<UTCTimestamp> {
    return { time: toTimestamp(candle.time), value: candle.close };
}

export function toVolumeData(
    candle: Candle,
    upColor: string,
    downColor: string,
): HistogramData<UTCTimestamp> | WhitespaceData<UTCTimestamp> {
    if (candle.volume === null) {
        return { time: toTimestamp(candle.time) };
    }

    return {
        time: toTimestamp(candle.time),
        value: candle.volume,
        color: candle.close >= candle.open ? upColor : downColor,
    };
}

export function toIndicatorLineData(
    candles: Candle[],
    values: (number | null)[],
): (LineData<UTCTimestamp> | WhitespaceData<UTCTimestamp>)[] {
    return candles.map((candle, index) => {
        const value = values[index];

        return value === null || value === undefined
            ? { time: toTimestamp(candle.time) }
            : { time: toTimestamp(candle.time), value };
    });
}
