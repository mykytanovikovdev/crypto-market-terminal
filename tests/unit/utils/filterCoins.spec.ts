import { describe, expect, it } from 'vitest';
import { filterCoins } from '@/utils/filterCoins';
import { coinListings } from '../../fixtures/coingecko';

function filteredIds(query: string, movement: 'all' | 'gainers' | 'losers' = 'all'): string[] {
    return filterCoins(coinListings, { query, movement }).map((coin) => coin.id);
}

describe('filterCoins', () => {
    it('returns everything without a query or movement filter', () => {
        expect(filteredIds('')).toHaveLength(coinListings.length);
    });

    it('matches name or ticker, ignoring case and surrounding spaces', () => {
        expect(filteredIds('  LITE ')).toEqual(['litecoin']);
        expect(filteredIds('btc')).toEqual(['bitcoin']);
    });

    it('keeps gainers or losers by 24h change and skips coins without data', () => {
        expect(filteredIds('', 'gainers')).toEqual(['bitcoin']);
        expect(filteredIds('', 'losers')).toEqual(['litecoin']);
    });

    it('combines search with the movement filter', () => {
        expect(filteredIds('coin', 'losers')).toEqual(['litecoin']);
        expect(filteredIds('bit', 'losers')).toEqual([]);
    });
});
