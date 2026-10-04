import { computed } from 'vue';
import { TOP_COINS_LIMIT, TOP_COINS_LIMIT_OPTIONS } from '@/api/coingecko';
import { readQueryString, useRouteQuery } from '@/composables/useRouteQuery';
import type { MovementFilter } from '@/types/market';

function isMovementFilter(value: string | null): value is MovementFilter {
    return value === 'all' || value === 'gainers' || value === 'losers';
}

function parseRowsLimit(value: string | null): number {
    const limit = Number(value);

    return TOP_COINS_LIMIT_OPTIONS.some((option) => option === limit) ? limit : TOP_COINS_LIMIT;
}

export function useMarketFiltersQuery() {
    const { route, updateQuery } = useRouteQuery();

    const searchQuery = computed<string>({
        get: () => readQueryString(route.query, 'q') ?? '',
        set: (value) => updateQuery({ q: value.trim() === '' ? undefined : value }),
    });

    const movement = computed<MovementFilter>({
        get: () => {
            const value = readQueryString(route.query, 'filter');

            return isMovementFilter(value) ? value : 'all';
        },
        set: (value) => updateQuery({ filter: value === 'all' ? undefined : value }),
    });

    const rowsLimit = computed<number>({
        get: () => parseRowsLimit(readQueryString(route.query, 'rows')),
        set: (value) =>
            updateQuery({ rows: value === TOP_COINS_LIMIT ? undefined : String(value) }),
    });

    const hasActiveFilters = computed(
        () => searchQuery.value.trim() !== '' || movement.value !== 'all',
    );

    function resetFilters(): void {
        updateQuery({ q: undefined, filter: undefined });
    }

    return { searchQuery, movement, rowsLimit, hasActiveFilters, resetFilters };
}
