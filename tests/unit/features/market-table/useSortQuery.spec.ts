import { flushPromises } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import { useSortQuery } from '@/features/market-table/useSortQuery';
import { withSetup } from '../../../helpers/withSetup';

describe('useSortQuery', () => {
    it('falls back to rank ascending without or with an invalid query', async () => {
        const { result } = await withSetup(useSortQuery, '/?sort=unknown&dir=sideways');

        expect(result.sort.value).toEqual({ key: 'rank', direction: 'asc' });
    });

    it('reads the sort key and direction from the URL', async () => {
        const { result } = await withSetup(useSortQuery, '/?sort=price&dir=asc');

        expect(result.sort.value).toEqual({ key: 'price', direction: 'asc' });
    });

    it('starts a new numeric column descending and toggles it on the next click', async () => {
        const { result, router } = await withSetup(useSortQuery);

        result.toggleSort('marketCap');
        await flushPromises();
        expect(router.currentRoute.value.query).toEqual({ sort: 'marketCap' });

        result.toggleSort('marketCap');
        await flushPromises();
        expect(router.currentRoute.value.query).toEqual({ sort: 'marketCap', dir: 'asc' });
    });

    it('keeps the URL clean when returning to the default sort', async () => {
        const { result, router } = await withSetup(useSortQuery, '/?sort=price&q=btc');

        result.toggleSort('rank');
        await flushPromises();

        expect(router.currentRoute.value.query).toEqual({ q: 'btc' });
    });
});
