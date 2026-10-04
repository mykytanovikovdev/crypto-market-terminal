import { describe, expect, it } from 'vitest';
import { getPriceDirection, getSeriesDirection } from '@/utils/priceDirection';

describe('getPriceDirection', () => {
    it('detects growth and decline', () => {
        expect(getPriceDirection(1.5)).toBe('up');
        expect(getPriceDirection(-0.01)).toBe('down');
    });

    it('treats changes that display as 0.00% as flat', () => {
        expect(getPriceDirection(0)).toBe('flat');
        expect(getPriceDirection(-0.004)).toBe('flat');
        expect(getPriceDirection(0.0049)).toBe('flat');
    });
});

describe('getSeriesDirection', () => {
    it('compares the last point with the first', () => {
        expect(getSeriesDirection([100, 90, 110])).toBe('up');
        expect(getSeriesDirection([100, 120, 95])).toBe('down');
    });

    it('returns flat for empty or zero-based series', () => {
        expect(getSeriesDirection([])).toBe('flat');
        expect(getSeriesDirection([0, 5])).toBe('flat');
    });
});
