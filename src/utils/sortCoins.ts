import type { CoinListing, SortDirection, SortKey, SortState } from '@/types/market';

const ASCENDING_BY_DEFAULT: ReadonlySet<SortKey> = new Set(['rank', 'name']);

export const DEFAULT_SORT: SortState = { key: 'rank', direction: 'asc' };

export function getDefaultDirection(key: SortKey): SortDirection {
    return ASCENDING_BY_DEFAULT.has(key) ? 'asc' : 'desc';
}

export function isDefaultSort(sort: SortState): boolean {
    return sort.key === DEFAULT_SORT.key && sort.direction === DEFAULT_SORT.direction;
}

function compareValues(
    first: number | string | null,
    second: number | string | null,
    direction: SortDirection,
): number {
    if (first === second) {
        return 0;
    }

    // Missing values stay at the bottom in both directions, as on most market screeners.
    if (first === null) {
        return 1;
    }

    if (second === null) {
        return -1;
    }

    const order =
        typeof first === 'string' && typeof second === 'string'
            ? first.localeCompare(second)
            : Number(first) - Number(second);

    return direction === 'asc' ? order : -order;
}

export function sortCoins(coins: CoinListing[], sort: SortState): CoinListing[] {
    return [...coins].sort((first, second) =>
        compareValues(first[sort.key], second[sort.key], sort.direction),
    );
}
