import { describe, expect, it } from 'vitest';
import {
    formatCompactCurrency,
    formatCompactNumber,
    formatPercent,
    formatPrice,
} from '@/utils/format';

describe('formatPrice', () => {
    it('shows cents for prices of a dollar and above', () => {
        expect(formatPrice(64250.12, 'en-US')).toBe('$64,250.12');
        expect(formatPrice(68.4, 'en-US')).toBe('$68.40');
    });

    it('keeps four significant digits for sub-dollar prices', () => {
        expect(formatPrice(0.3357, 'en-US')).toBe('$0.3357');
        expect(formatPrice(0.000123456, 'en-US')).toBe('$0.0001235');
    });

    it('switches to cents when a sub-dollar price rounds up to a dollar', () => {
        expect(formatPrice(0.99996, 'en-US')).toBe('$1.00');
    });

    it('keeps Latin digits for the Persian locale', () => {
        expect(formatPrice(68.4, 'fa-IR-u-nu-latn')).toContain('68.40');
    });
});

describe('formatPercent', () => {
    it('drops the sign because direction is shown separately', () => {
        expect(formatPercent(2.345, 'en-US')).toBe('2.35%');
        expect(formatPercent(-1.2, 'en-US')).toBe('1.20%');
    });
});

describe('compact formatting', () => {
    it('formats currency amounts in compact notation', () => {
        expect(formatCompactCurrency(1_265_000_000_000, 'en-US')).toBe('$1.27T');
        expect(formatCompactCurrency(410_000_000, 'en-US')).toBe('$410M');
    });

    it('formats plain numbers in compact notation', () => {
        expect(formatCompactNumber(19_700_000, 'en-US')).toBe('19.7M');
    });
});
