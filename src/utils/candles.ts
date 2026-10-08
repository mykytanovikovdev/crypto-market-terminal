import type { Candle } from '@/types/market';

export function applyLivePriceToCandles(
    candles: Candle[],
    price: number,
    nowMs: number,
    intervalMs: number,
): Candle[] {
    const lastCandle = candles.at(-1);

    if (!lastCandle) {
        return candles;
    }

    const lastCandleEndMs = lastCandle.time * 1000 + intervalMs;

    if (nowMs >= lastCandleEndMs) {
        const elapsedIntervals = Math.floor((nowMs - lastCandle.time * 1000) / intervalMs);
        const newCandle: Candle = {
            time: lastCandle.time + (elapsedIntervals * intervalMs) / 1000,
            open: lastCandle.close,
            high: Math.max(lastCandle.close, price),
            low: Math.min(lastCandle.close, price),
            close: price,
            volume: lastCandle.volume === null ? null : 0,
        };

        return [...candles, newCandle];
    }

    const updatedCandle: Candle = {
        ...lastCandle,
        high: Math.max(lastCandle.high, price),
        low: Math.min(lastCandle.low, price),
        close: price,
    };

    return [...candles.slice(0, -1), updatedCandle];
}
