import { describe, expect, it } from 'vitest';
import { getPriceDirection } from '@/utils/priceDirection';

describe('getPriceDirection', () => {
    it('treats growth and no change as up', () => {
        expect(getPriceDirection(1.5)).toBe('up');
        expect(getPriceDirection(0)).toBe('up');
    });

    it('treats a decline as down', () => {
        expect(getPriceDirection(-0.01)).toBe('down');
    });
});
