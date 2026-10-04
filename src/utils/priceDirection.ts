import type { PriceDirection } from '@/types/market';

const DISPLAY_PRECISION = 100;

export function getPriceDirection(percentChange: number): PriceDirection {
    const displayedChange = Math.round(percentChange * DISPLAY_PRECISION);

    if (displayedChange === 0) {
        return 'flat';
    }

    return displayedChange > 0 ? 'up' : 'down';
}

export function getSeriesDirection(points: number[]): PriceDirection {
    const first = points[0];
    const last = points[points.length - 1];

    if (first === undefined || last === undefined || first === 0) {
        return 'flat';
    }

    return getPriceDirection(((last - first) / first) * 100);
}
