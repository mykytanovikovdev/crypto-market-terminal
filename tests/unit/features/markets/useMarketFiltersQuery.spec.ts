import { flushPromises } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import { useMarketFiltersQuery } from '@/features/markets/useMarketFiltersQuery';
import { withSetup } from '../../../helpers/withSetup';

describe('useMarketFiltersQuery', () => {
    it('uses defaults for missing or invalid values', async () => {
        const { result } = await withSetup(useMarketFiltersQuery, '/?filter=moon&rows=7');

        expect(result.searchQuery.value).toBe('');
        expect(result.movement.value).toBe('all');
        expect(result.rowsLimit.value).toBe(50);
        expect(result.hasActiveFilters.value).toBe(false);
    });

    it('reads filters from the URL', async () => {
        const { result } = await withSetup(useMarketFiltersQuery, '/?q=eth&filter=losers&rows=100');

        expect(result.searchQuery.value).toBe('eth');
        expect(result.movement.value).toBe('losers');
        expect(result.rowsLimit.value).toBe(100);
        expect(result.hasActiveFilters.value).toBe(true);
    });

    it('writes changes to the URL and drops default values', async () => {
        const { result, router } = await withSetup(useMarketFiltersQuery, '/?sort=price');

        result.searchQuery.value = 'sol';
        result.movement.value = 'gainers';
        result.rowsLimit.value = 100;
        await flushPromises();

        expect(router.currentRoute.value.query).toEqual({
            sort: 'price',
            q: 'sol',
            filter: 'gainers',
            rows: '100',
        });

        result.movement.value = 'all';
        result.rowsLimit.value = 50;
        await flushPromises();

        expect(router.currentRoute.value.query).toEqual({ sort: 'price', q: 'sol' });
    });

    it('clears search and movement but keeps sorting and rows on reset', async () => {
        const { result, router } = await withSetup(
            useMarketFiltersQuery,
            '/?sort=price&q=eth&filter=losers&rows=100',
        );

        result.resetFilters();
        await flushPromises();

        expect(router.currentRoute.value.query).toEqual({ sort: 'price', rows: '100' });
    });
});
