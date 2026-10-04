import { describe, expect, it } from 'vitest';
import type { CoinListing } from '@/types/market';
import { DEFAULT_SORT, getDefaultDirection, isDefaultSort, sortCoins } from '@/utils/sortCoins';
import { coinListings } from '../../fixtures/coingecko';

function ids(coins: CoinListing[]): string[] {
    return coins.map((coin) => coin.id);
}

describe('sortCoins', () => {
    it('sorts numbers in both directions', () => {
        expect(ids(sortCoins(coinListings, { key: 'price', direction: 'desc' }))).toEqual([
            'bitcoin',
            'litecoin',
            'new-listing',
        ]);
        expect(ids(sortCoins(coinListings, { key: 'price', direction: 'asc' }))).toEqual([
            'new-listing',
            'litecoin',
            'bitcoin',
        ]);
    });

    it('sorts names alphabetically', () => {
        expect(ids(sortCoins(coinListings, { key: 'name', direction: 'desc' }))).toEqual([
            'new-listing',
            'litecoin',
            'bitcoin',
        ]);
    });

    it('keeps missing values at the bottom in both directions', () => {
        expect(ids(sortCoins(coinListings, { key: 'change24h', direction: 'desc' })).at(-1)).toBe(
            'new-listing',
        );
        expect(ids(sortCoins(coinListings, { key: 'change24h', direction: 'asc' })).at(-1)).toBe(
            'new-listing',
        );
        expect(ids(sortCoins(coinListings, { key: 'rank', direction: 'asc' })).at(-1)).toBe(
            'new-listing',
        );
    });

    it('does not mutate the original list', () => {
        const original = [...coinListings];

        sortCoins(coinListings, { key: 'price', direction: 'asc' });

        expect(coinListings).toEqual(original);
    });
});

describe('sort defaults', () => {
    it('starts rank and name ascending, numbers descending', () => {
        expect(getDefaultDirection('rank')).toBe('asc');
        expect(getDefaultDirection('name')).toBe('asc');
        expect(getDefaultDirection('marketCap')).toBe('desc');
    });

    it('recognises the default sort', () => {
        expect(isDefaultSort(DEFAULT_SORT)).toBe(true);
        expect(isDefaultSort({ key: 'rank', direction: 'desc' })).toBe(false);
    });
});
