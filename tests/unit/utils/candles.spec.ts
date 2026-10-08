import { describe, expect, it } from 'vitest';
import { applyLivePriceToCandles } from '@/utils/candles';
import { createHourlyCandles } from '../../fixtures/coinDetails';

const HOUR_MS = 3_600_000;

describe('applyLivePriceToCandles', () => {
    const candles = createHourlyCandles([100, 110]);
    const lastCandle = candles.at(-1)!;
    const lastOpenMs = lastCandle.time * 1000;

    it('moves close, high and low of the current candle', () => {
        const higher = applyLivePriceToCandles(candles, 130, lastOpenMs + 1000, HOUR_MS);
        const lower = applyLivePriceToCandles(candles, 90, lastOpenMs + 1000, HOUR_MS);

        expect(higher).toHaveLength(2);
        expect(higher.at(-1)).toMatchObject({ close: 130, high: 130, low: 100 });
        expect(lower.at(-1)).toMatchObject({ close: 90, high: 120, low: 90 });
    });

    it('opens a new candle once the interval has passed', () => {
        const updated = applyLivePriceToCandles(candles, 115, lastOpenMs + HOUR_MS + 5, HOUR_MS);

        expect(updated).toHaveLength(3);
        expect(updated.at(-1)).toEqual({
            time: lastCandle.time + 3600,
            open: 110,
            high: 115,
            low: 110,
            close: 115,
            volume: 0,
        });
    });

    it('aligns the new candle to the interval grid after a pause', () => {
        const updated = applyLivePriceToCandles(
            candles,
            115,
            lastOpenMs + 3 * HOUR_MS + 5,
            HOUR_MS,
        );

        expect(updated.at(-1)?.time).toBe(lastCandle.time + 3 * 3600);
    });

    it('keeps the original array untouched and handles an empty series', () => {
        applyLivePriceToCandles(candles, 500, lastOpenMs, HOUR_MS);

        expect(candles.at(-1)?.close).toBe(110);
        expect(applyLivePriceToCandles([], 1, 0, HOUR_MS)).toEqual([]);
    });
});
