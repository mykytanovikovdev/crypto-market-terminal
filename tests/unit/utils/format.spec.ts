import { describe, expect, it } from 'vitest';
import { formatMarketCap, formatPercentChange, formatPrice } from '@/utils/format';

describe('formatPrice', () => {
    it('drops cents for prices of a thousand dollars and above', () => {
        expect(formatPrice(64250.12, 'en-US')).toBe('$64,250');
    });

    it('keeps two decimals for prices between one and a thousand dollars', () => {
        expect(formatPrice(68.4, 'en-US')).toBe('$68.40');
    });

    it('keeps significant digits for sub-dollar prices', () => {
        expect(formatPrice(0.000123456, 'en-US')).toBe('$0.0001235');
    });
});

describe('formatPercentChange', () => {
    it('prefixes positive changes with a plus sign', () => {
        expect(formatPercentChange(2.345, 'en-US')).toBe('+2.35%');
    });

    it('keeps the minus sign for negative changes', () => {
        expect(formatPercentChange(-1.2, 'en-US')).toBe('-1.20%');
    });

    it('shows zero without a sign', () => {
        expect(formatPercentChange(0, 'en-US')).toBe('0.00%');
    });
});

describe('formatMarketCap', () => {
    it('uses compact notation', () => {
        expect(formatMarketCap(1_265_000_000_000, 'en-US')).toBe('$1.3T');
        expect(formatMarketCap(5_120_000_000, 'en-US')).toBe('$5.1B');
    });
});
