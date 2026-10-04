import { describe, expect, it } from 'vitest';
import { buildSparklinePath } from '@/utils/sparkline';

describe('buildSparklinePath', () => {
    it('maps the lowest point to the bottom and the highest to the top', () => {
        expect(buildSparklinePath([10, 20, 15], 100, 40)).toBe(
            'M0.00,40.00 L50.00,0.00 L100.00,20.00',
        );
    });

    it('returns an empty path when there is nothing to draw', () => {
        expect(buildSparklinePath([], 100, 40)).toBe('');
        expect(buildSparklinePath([5], 100, 40)).toBe('');
    });

    it('draws a flat series along the bottom', () => {
        expect(buildSparklinePath([3, 3], 10, 10)).toBe('M0.00,10.00 L10.00,10.00');
    });

    it('downsamples long series to keep the path light', () => {
        const hourlyWeek = Array.from({ length: 168 }, (_, hour) => hour);
        const segments = buildSparklinePath(hourlyWeek, 100, 40).split(' ');

        expect(segments).toHaveLength(56);
        expect(segments.at(-1)).toBe('L100.00,0.00');
    });
});
