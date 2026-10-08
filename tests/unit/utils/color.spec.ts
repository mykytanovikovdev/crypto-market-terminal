import { describe, expect, it } from 'vitest';
import { withAlpha } from '@/utils/color';

describe('withAlpha', () => {
    it('converts six- and three-digit hex colors to rgb with alpha', () => {
        expect(withAlpha('#0a8754', 0.35)).toBe('rgb(10 135 84 / 35%)');
        expect(withAlpha(' #fff ', 0)).toBe('rgb(255 255 255 / 0%)');
    });
});
