import { computed } from 'vue';
import { readQueryString, useRouteQuery } from '@/composables/useRouteQuery';
import type { SortDirection, SortKey, SortState } from '@/types/market';
import { DEFAULT_SORT, getDefaultDirection, isDefaultSort } from '@/utils/sortCoins';

const SORT_KEYS: readonly SortKey[] = [
    'rank',
    'name',
    'price',
    'change1h',
    'change24h',
    'change7d',
    'marketCap',
    'volume24h',
    'circulatingSupply',
];

function isSortKey(value: string | null): value is SortKey {
    return SORT_KEYS.some((key) => key === value);
}

function isSortDirection(value: string | null): value is SortDirection {
    return value === 'asc' || value === 'desc';
}

export function useSortQuery() {
    const { route, updateQuery } = useRouteQuery();

    const sort = computed<SortState>(() => {
        const key = readQueryString(route.query, 'sort');
        const direction = readQueryString(route.query, 'dir');

        if (!isSortKey(key)) {
            return DEFAULT_SORT;
        }

        return {
            key,
            direction: isSortDirection(direction) ? direction : getDefaultDirection(key),
        };
    });

    function getNextSort(key: SortKey): SortState {
        if (key !== sort.value.key) {
            return { key, direction: getDefaultDirection(key) };
        }

        return { key, direction: sort.value.direction === 'asc' ? 'desc' : 'asc' };
    }

    function toggleSort(key: SortKey): void {
        const nextSort = getNextSort(key);
        const usesDefaultDirection = nextSort.direction === getDefaultDirection(nextSort.key);

        updateQuery({
            sort: isDefaultSort(nextSort) ? undefined : nextSort.key,
            dir: usesDefaultDirection ? undefined : nextSort.direction,
        });
    }

    return { sort, toggleSort };
}
