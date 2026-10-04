import type { PriceDirection } from '@/types/market';

export function getPriceDirection(change: number): PriceDirection {
    return change >= 0 ? 'up' : 'down';
}
