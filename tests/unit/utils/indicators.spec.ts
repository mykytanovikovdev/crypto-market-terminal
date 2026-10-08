import { describe, expect, it } from 'vitest';
import { calculateRsi, calculateSma } from '@/utils/indicators';

describe('calculateSma', () => {
    it('averages the trailing window and leaves the warm-up empty', () => {
        expect(calculateSma([1, 2, 3, 4, 5], 3)).toEqual([null, null, 2, 3, 4]);
    });

    it('returns only empty values when the series is shorter than the period', () => {
        expect(calculateSma([1, 2], 3)).toEqual([null, null]);
    });
});

describe('calculateRsi', () => {
    it('needs one full period of changes before the first value', () => {
        const values = Array.from({ length: 20 }, (_, index) => 100 + index);
        const rsi = calculateRsi(values, 14);

        expect(rsi.slice(0, 14).every((value) => value === null)).toBe(true);
        expect(rsi[14]).not.toBeNull();
    });

    it('is 100 for a series that only rises and 0 for one that only falls', () => {
        const rising = Array.from({ length: 20 }, (_, index) => 100 + index);
        const falling = [...rising].reverse();

        expect(calculateRsi(rising, 14).at(-1)).toBe(100);
        expect(calculateRsi(falling, 14).at(-1)).toBe(0);
    });

    it('is neutral for a flat series', () => {
        expect(calculateRsi(Array(20).fill(50), 14).at(-1)).toBe(50);
    });

    it('matches the StockCharts reference calculation of Wilder RSI', () => {
        const closes = [
            44.3389, 44.0902, 44.1497, 43.6124, 44.3278, 44.8264, 45.0955, 45.4245, 45.8433,
            46.0826, 45.8931, 46.0328, 45.614, 46.282, 46.282, 46.0028, 46.0328, 46.4116, 46.2222,
            45.6439,
        ];
        const rsi = calculateRsi(closes, 14)
            .slice(14)
            .map((value) => Number(value?.toFixed(2)));

        expect(rsi).toEqual([70.53, 66.32, 66.55, 69.41, 66.36, 57.97]);
    });
});
